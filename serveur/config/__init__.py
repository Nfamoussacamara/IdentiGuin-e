from __future__ import annotations

# Cela garantit que l'application est toujours importée lorsque
# Django démarre, afin que shared_task utilise cette application.
from .celery import app as celery_app

__all__ = ('celery_app',)
