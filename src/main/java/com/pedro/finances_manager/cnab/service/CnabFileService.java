package com.pedro.finances_manager.cnab.service;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CnabFileService {

	private static final Logger log = LoggerFactory.getLogger(CnabFileService.class);
	private static final Charset CNAB_CHARSET = Charset.forName("ISO-8859-1");

	public void processPath(Path file) {
		try {
			String bankCode = readBankCode(file);
			log.info("CNAB processado: file={} banco={}", file.getFileName(), bankCode);
		} catch (IOException e) {
			log.error("Falha ao processar {}: {}", file.getFileName(), e.getMessage());
			throw new RuntimeException("Erro ao processar arquivo CNAB: " + file.getFileName(), e);
		}
	}

	/**
	 * Lê o código do banco das posições 1-3 da primeira linha (CNAB).
	 */
	public String readBankCode(Path file) throws IOException {
		try (var reader = Files.newBufferedReader(file, CNAB_CHARSET)) {
			String line = reader.readLine();
			if (line == null || line.length() < 3) {
				throw new IOException("Arquivo vazio ou linha de header inválida: " + file.getFileName());
			}
			return line.substring(0, 3);
		}
	}
}
