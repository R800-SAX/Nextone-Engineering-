import os
import sys
import importlib.util

# Dynamically load the NextOne Engineering application from subfolder
base_dir = os.path.dirname(os.path.abspath(__file__))
subfolder = os.path.join(base_dir, "nextone weebsite")
target_file = os.path.join(subfolder, "app.py")

if os.path.exists(subfolder):
    if subfolder not in sys.path:
        sys.path.insert(0, subfolder)
    os.chdir(subfolder)

spec = importlib.util.spec_from_file_location("nextone_main", target_file)
nextone_module = importlib.util.module_from_spec(spec)
sys.modules["nextone_main"] = nextone_module
spec.loader.exec_module(nextone_module)

app = nextone_module.app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() in ["true", "1"]
    app.run(host="0.0.0.0", port=port, debug=debug)
