from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "sua_senha"
    DB_NAME: str = "plataforma_tic"

    class Config:
        env_file = ".env"

settings = Settings()
