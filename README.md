# Explorer-Stage10-Atividade-API-RestFull
Explorer-Stage10-Atividade-API-RestFull

Estrutura de pastas:

->  src  
    |_configs  
    |_controlers -> Pasta com regra de negócios das rotas  
    |_database  
    |  |_knex  
    |  |    |_migrations -> Criação de migrations utilizando o Query Builder knex  
    |  |_sqlite  
    |  |    |_migrations -> Exemplo de criação de migration utilizando códigos SQL  
    |  |_database.db -> Arquivo do banco de dados SQLite  
    |_middlewares
    |_providers
    |_repositories -> Códigos que interagem com o banco de dados para serem utilizados nos controllers
