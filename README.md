🛠️ Tecnologias

Backend
Java 17
Spring Boot 4
Spring Web MVC
Spring Data JPA
Spring Security
JWT
PostgreSQL
Flyway
RabbitMQ
Maven
Swagger / OpenAPI
Lombok
Frontend
React
TypeScript
Vite
React Router
Axios
Recharts
Lucide React
Infraestrutura
Docker
Docker Compose
PostgreSQL 16
RabbitMQ

💰 Funcionalidades

Atualmente o projeto possui funcionalidades relacionadas a:

Autenticação e autorização utilizando JWT
Gerenciamento de usuários
Cadastro de contas financeiras
Cadastro de categorias
Registro de transações
Controle de receitas e despesas
Resumos financeiros por categoria e tipo de conta
Visualização de dados financeiros através de gráficos
Integração com RabbitMQ para processamento de eventos
Versionamento do banco de dados utilizando Flyway
Documentação da API com Swagger/OpenAPI

🗄️ Banco de dados

O PostgreSQL é utilizado como banco de dados principal.

As alterações de estrutura do banco são versionadas utilizando Flyway, permitindo que a evolução do schema acompanhe o código da aplicação.

---

## 🚧 Status do projeto

Em desenvolvimento.

Novas funcionalidades e melhorias de arquitetura estão sendo adicionadas gradualmente.

---



🐳 Executando a infraestrutura

O repositório possui um docker-compose.yml para inicializar PostgreSQL e RabbitMQ.

docker compose up -d

Os serviços serão disponibilizados por padrão em:

Serviço	Porta
PostgreSQL	5432
RabbitMQ	5672
RabbitMQ Management	15672
⚙️ Executando o backend

Clone o projeto:

git clone https://github.com/PedroCodeSilv/Finance-Managering.git
cd Finance-Managering

Inicialize PostgreSQL e RabbitMQ:

docker compose up -d

Execute a aplicação:

Linux / macOS
./mvnw spring-boot:run
Windows
mvnw.cmd spring-boot:run
🖥️ Executando o frontend

Acesse o diretório:

cd frontend

Instale as dependências:

npm install

Execute o ambiente de desenvolvimento:

npm run dev

O endereço utilizado pelo Vite será exibido no terminal.

📚 API

O backend utiliza Swagger/OpenAPI para documentação dos endpoints.

Após iniciar a aplicação, a interface do Swagger pode ser utilizada para explorar e testar a API.

O repositório também contém uma collection do Postman:

Finance-Manager.postman_collection.json


👨‍💻 Autor

Desenvolvido por Pedro Cordeiro.

GitHub: @PedroCodeSilv
