from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "personal-kb"
    api_prefix: str = "/api"
    debug: bool = True

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/personal_kb"
    redis_url: str = "redis://localhost:6379/0"

    upload_dir: str = "uploads"

    cors_origins: list[str] = ["http://localhost:5173"]

    jwt_secret: str = "change-me"
    jwt_expire_minutes: int = 60 * 24 * 7 # 7 days


settings = Settings()
