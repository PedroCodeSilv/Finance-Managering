import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { FileUp, Loader2, CircleCheck, CircleX, FileText } from "lucide-react";
import {
  ALLOWED_CNAB_EXTENSIONS,
  formatFileSize,
  hasAllowedCnabExtension,
  validateCnabFile,
  type CnabValidationResult,
} from "../cnab/cnabValidation";

type DropState = "idle" | "hover" | "loading" | "success" | "error";

export function CnabMonitor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropState, setDropState] = useState<DropState>("idle");
  const [result, setResult] = useState<CnabValidationResult | null>(null);
  const [extensionError, setExtensionError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setExtensionError(null);
    setResult(null);

    if (!hasAllowedCnabExtension(file.name)) {
      setDropState("error");
      setExtensionError(
        `Extensão inválida. Aceito apenas ${ALLOWED_CNAB_EXTENSIONS.join(", ")}`,
      );
      return;
    }

    setDropState("loading");
    try {
      const validation = await validateCnabFile(file);
      setResult(validation);
      setDropState(validation.valid ? "success" : "error");
    } catch {
      setDropState("error");
      setExtensionError("Não foi possível ler o arquivo. Tente novamente.");
    }
  }, []);

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) void processFile(file);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
    event.target.value = "";
  };

  const borderByState: Record<DropState, string> = {
    idle: "border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50",
    hover: "border-sky-500 bg-sky-100 scale-[1.01]",
    loading: "border-sky-400 bg-sky-50",
    success: "border-emerald-500 bg-emerald-50",
    error: "border-red-400 bg-red-50",
  };

  return (
    <div className="main-content">
      <div className="flex flex-col gap-6">
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.rem,.ret"
          className="hidden"
          onChange={onChange}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDropState((prev) => (prev === "loading" ? prev : "hover"));
          }}
          onDragLeave={() =>
            setDropState((prev) => {
              if (prev === "loading") return prev;
              if (result?.valid) return "success";
              if (result || extensionError) return "error";
              return "idle";
            })
          }
          onDrop={onDrop}
          disabled={dropState === "loading"}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${borderByState[dropState]}`}
        >
          {dropState === "loading" ? (
            <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
          ) : dropState === "success" ? (
            <CircleCheck className="h-10 w-10 text-emerald-600" />
          ) : dropState === "error" ? (
            <CircleX className="h-10 w-10 text-red-500" />
          ) : (
            <FileUp className="h-10 w-10 text-sky-600" />
          )}

          <div>
            <p className="text-base font-semibold text-slate-800">
              {dropState === "loading"
                ? "Validando arquivo CNAB..."
                : dropState === "hover"
                  ? "Solte o arquivo para validar"
                  : "Arraste um arquivo CNAB ou clique para selecionar"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Somente .txt, .rem ou .ret — validação local (CNAB 240 / 400)
            </p>
          </div>
        </button>

        {extensionError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {extensionError}
          </p>
        )}

        {result && <ValidationDashboard result={result} />}
      </div>
    </div>
  );
}

function ValidationDashboard({ result }: { result: CnabValidationResult }) {
  const ok = result.valid;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-slate-500" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {result.fileName}
            </h3>
            <p className="text-xs text-slate-500">
              {formatFileSize(result.fileSize)}
              {result.layout ? ` • ${result.layout.replace("_", " ")}` : ""}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {ok ? "Válido para Envio" : "Contém Erros"}
        </span>
      </header>

      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        <Stat label="Layout" value={result.layout?.replace("_", " ") ?? "—"} />
        <Stat label="Linhas" value={String(result.lineCount)} />
        <Stat
          label="Erros"
          value={String(result.errors.length)}
          danger={result.errors.length > 0}
        />
      </div>

      {result.errors.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-4">
          <h4 className="mb-2 text-sm font-semibold text-slate-700">
            Lista de erros
          </h4>
          <ul className="max-h-64 overflow-y-auto rounded-xl border border-red-100 bg-red-50/60 p-2">
            {result.errors.map((err, index) => (
              <li
                key={`${err.line}-${index}`}
                className="border-b border-red-100 px-3 py-2 text-sm text-red-800 last:border-b-0"
              >
                <span className="font-semibold">Linha {err.line}:</span>{" "}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <main className="main-content">
      <h2 className="page-title">Cnab Monitor</h2>
      <div className="rounded-xl bg-slate-50 px-3 py-3">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div
          className={`mt-1 text-lg font-bold ${danger ? "text-red-600" : "text-slate-800"}`}
        >
          {value}
        </div>
      </div>
    </main>
  );
}

export default CnabMonitor;
