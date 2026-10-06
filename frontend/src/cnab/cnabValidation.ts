export type CnabLayout = "CNAB_240" | "CNAB_400";

export interface CnabLineError {
  line: number;
  message: string;
}

export interface CnabValidationResult {
  fileName: string;
  fileSize: number;
  layout: CnabLayout | null;
  lineCount: number;
  valid: boolean;
  errors: CnabLineError[];
}

export const ALLOWED_CNAB_EXTENSIONS = [".txt", ".rem", ".ret"] as const;

const CHUNK_SIZE = 256 * 1024;
const CNAB_ENCODING = "ISO-8859-1";

export function hasAllowedCnabExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ALLOWED_CNAB_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function detectCnabLayout(firstLine: string): CnabLayout | null {
  const length = stripNewlines(firstLine).length;
  if (length === 240) return "CNAB_240";
  if (length === 400) return "CNAB_400";
  return null;
}

export function expectedLineLength(layout: CnabLayout): number {
  return layout === "CNAB_240" ? 240 : 400;
}

/** Tipo de registro: CNAB 240 na posição 8; CNAB 400 na posição 1 (1-based). */
export function recordTypePosition(layout: CnabLayout): number {
  return layout === "CNAB_240" ? 8 : 1;
}

export function stripNewlines(line: string): string {
  return line.replace(/[\r\n]/g, "");
}

function charAt(line: string, position1Based: number): string {
  return line.charAt(position1Based - 1) ?? "";
}

function sliceField(line: string, start1Based: number, end1BasedInclusive: number): string {
  return line.slice(start1Based - 1, end1BasedInclusive);
}

function readSlice(file: File, start: number, end: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Falha ao ler o arquivo"));
    reader.readAsText(file.slice(start, end), CNAB_ENCODING);
  });
}

/**
 * Lê o arquivo em pedaços com FileReader (ISO-8859-1) e valida linha a linha,
 * sem guardar o arquivo inteiro em memória.
 */
export async function validateCnabFile(file: File): Promise<CnabValidationResult> {
  const errors: CnabLineError[] = [];
  let layout: CnabLayout | null = null;
  let lineCount = 0;
  let previousWasSegmentA = false;
  let previousLote = "";
  let headerOk = false;
  let lastLine = "";
  let leftover = "";
  let aborted = false;

  const failEarly = (line: number, message: string): CnabValidationResult => ({
    fileName: file.name,
    fileSize: file.size,
    layout,
    lineCount,
    valid: false,
    errors: [{ line, message }],
  });

  const processLine = (raw: string): boolean => {
    const line = stripNewlines(raw);
    if (line.length === 0 && lineCount === 0) {
      return true;
    }

    if (lineCount === 0) {
      layout = detectCnabLayout(line);
      if (!layout) {
        errors.push({
          line: 1,
          message: `Layout inválido: a primeira linha tem ${line.length} caracteres (esperado 240 ou 400)`,
        });
        aborted = true;
        return false;
      }

      const typePos = recordTypePosition(layout);
      const headerType = charAt(line, typePos);
      if (headerType !== "0") {
        errors.push({
          line: 1,
          message: `Header inválido: esperado tipo de registro 0 na posição ${typePos}, encontrado '${headerType || "vazio"}'`,
        });
      } else {
        headerOk = true;
      }
    }

    lineCount += 1;
    lastLine = line;

    if (!layout) return false;

    const expected = expectedLineLength(layout);
    if (line.length !== expected) {
      errors.push({
        line: lineCount,
        message: `Tamanho inválido: ${line.length} caracteres (esperado ${expected})`,
      });
    }

    if (layout === "CNAB_240" && line.length >= 14) {
      const tipoRegistro = charAt(line, 8);
      const segmento = charAt(line, 14);
      const lote = sliceField(line, 4, 7);

      if (tipoRegistro === "3" && segmento === "A") {
        previousWasSegmentA = true;
        previousLote = lote;
      } else if (tipoRegistro === "3" && segmento === "B") {
        if (!previousWasSegmentA) {
          errors.push({
            line: lineCount,
            message: "Segmento B órfão sem Segmento A anterior",
          });
        } else if (lote !== previousLote) {
          errors.push({
            line: lineCount,
            message: `Segmento B do lote ${lote} não corresponde ao Segmento A do lote ${previousLote}`,
          });
        }
        previousWasSegmentA = false;
        previousLote = "";
      } else {
        if (previousWasSegmentA) {
          errors.push({
            line: lineCount - 1,
            message:
              "Segmento A sem Segmento B correspondente na linha seguinte (mesmo lote de serviço)",
          });
        }
        previousWasSegmentA = false;
        previousLote = "";
      }
    }

    return true;
  };

  for (let offset = 0; offset < file.size && !aborted; offset += CHUNK_SIZE) {
    const chunk = await readSlice(file, offset, Math.min(offset + CHUNK_SIZE, file.size));
    const data = leftover + chunk;
    const parts = data.split(/\r?\n/);
    leftover = parts.pop() ?? "";

    for (const part of parts) {
      if (!processLine(part)) {
        return failEarly(1, errors[0]?.message ?? "Layout inválido");
      }
    }
  }

  if (aborted) {
    return failEarly(1, errors[0]?.message ?? "Layout inválido");
  }

  if (leftover.length > 0 || lineCount === 0) {
    if (!processLine(leftover)) {
      return failEarly(1, errors[0]?.message ?? "Layout inválido");
    }
  }

  if (lineCount === 0) {
    return failEarly(1, "Arquivo vazio");
  }

  if (previousWasSegmentA) {
    errors.push({
      line: lineCount,
      message:
        "Segmento A sem Segmento B correspondente na linha seguinte (mesmo lote de serviço)",
    });
  }

  if (layout) {
    const typePos = recordTypePosition(layout);
    const trailerType = charAt(lastLine, typePos);
    if (trailerType !== "9") {
      errors.push({
        line: lineCount,
        message: `Trailer inválido: esperado tipo de registro 9 na posição ${typePos}, encontrado '${trailerType || "vazio"}'`,
      });
    }
  }

  if (headerOk && lineCount === 1 && layout) {
    errors.push({
      line: 1,
      message: "Arquivo incompleto: header e trailer não podem ser a mesma linha",
    });
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    layout,
    lineCount,
    valid: errors.length === 0,
    errors,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
