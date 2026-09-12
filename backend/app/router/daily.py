from flask import Blueprint, current_app, request

files_bp = Blueprint("files", __name__)


@files_bp.get("/today")
def today():
    storage_path = current_app.config["FILE_STORAGE_PATH"]
    path = request.args.get("path", "/")

    return {
        "storage": storage_path,
        "path": path,
    }
