package com.pedro.finances_manager.cnab.watcher;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.pedro.finances_manager.cnab.service.CnabFileService;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

/**
 * Observa a pasta de entrada de arquivos CNAB via {@link WatchService}
 * e delega o processamento para {@link CnabFileService}.
 *
 * Ative com: cnab.watch.enabled=true
 */
@Component
@ConditionalOnProperty(name = "cnab.watch.enabled", havingValue = "true")
public class CnabFolderWatcher {

	private static final Logger log = LoggerFactory.getLogger(CnabFolderWatcher.class);

	private final Path inboundPath;
	private final Path processedPath;
	private final Path errorPath;
	private final CnabFileService cnabFileService;

	private WatchService watchService;
	private Thread watchThread;
	private volatile boolean running;

	public CnabFolderWatcher(
			@Value("${cnab.watch.inbound-dir:./data/cnab/inbound}") String inboundDir,
			@Value("${cnab.watch.processed-dir:./data/cnab/processed}") String processedDir,
			@Value("${cnab.watch.error-dir:./data/cnab/error}") String errorDir,
			CnabFileService cnabFileService) {
		this.inboundPath = Paths.get(inboundDir).toAbsolutePath().normalize();
		this.processedPath = Paths.get(processedDir).toAbsolutePath().normalize();
		this.errorPath = Paths.get(errorDir).toAbsolutePath().normalize();
		this.cnabFileService = cnabFileService;
	}

	@PostConstruct
	public void start() throws IOException {
		Files.createDirectories(inboundPath);
		Files.createDirectories(processedPath);
		Files.createDirectories(errorPath);

		watchService = FileSystems.getDefault().newWatchService();
		inboundPath.register(
				watchService,
				StandardWatchEventKinds.ENTRY_CREATE,
				StandardWatchEventKinds.ENTRY_MODIFY);

		running = true;
		watchThread = new Thread(this::watchLoop, "cnab-folder-watcher");
		watchThread.setDaemon(true);
		watchThread.start();

		log.info("CNAB WatchService ativo. inbound={}", inboundPath);
	}

	@PreDestroy
	public void stop() {
		running = false;
		if (watchService != null) {
			try {
				watchService.close();
			} catch (IOException e) {
				log.warn("Erro ao fechar WatchService: {}", e.getMessage());
			}
		}
		if (watchThread != null) {
			watchThread.interrupt();
		}
		log.info("CNAB WatchService encerrado.");
	}

	private void watchLoop() {
		while (running) {
			WatchKey key;
			try {
				key = watchService.take();
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
				break;
			} catch (Exception e) {
				if (running) {
					log.error("WatchService interrompido: {}", e.getMessage());
				}
				break;
			}

			for (WatchEvent<?> event : key.pollEvents()) {
				WatchEvent.Kind<?> kind = event.kind();
				if (kind == StandardWatchEventKinds.OVERFLOW) {
					continue;
				}

				@SuppressWarnings("unchecked")
				WatchEvent<Path> pathEvent = (WatchEvent<Path>) event;
				Path fileName = pathEvent.context();
				Path fullPath = inboundPath.resolve(fileName);

				if (!Files.isRegularFile(fullPath)) {
					continue;
				}

				if (!isCnabCandidate(fileName.toString())) {
					log.debug("Arquivo ignorado (extensão): {}", fileName);
					continue;
				}

				if (kind == StandardWatchEventKinds.ENTRY_CREATE
						|| kind == StandardWatchEventKinds.ENTRY_MODIFY) {
					onFileDetected(fullPath);
				}
			}

			boolean valid = key.reset();
			if (!valid) {
				log.error("WatchKey inválida. Encerrando watcher da pasta {}", inboundPath);
				break;
			}
		}
	}

	private void onFileDetected(Path file) {
		log.info("Arquivo CNAB detectado: {}", file);
		try {
			cnabFileService.processPath(file);
		} catch (Exception e) {
			log.error("Erro ao processar {}: {}", file.getFileName(), e.getMessage());
		}
	}

	private boolean isCnabCandidate(String fileName) {
		String lower = fileName.toLowerCase();
		return lower.endsWith(".ret")
				|| lower.endsWith(".rem")
				|| lower.endsWith(".txt")
				|| lower.endsWith(".cnab");
	}
}
