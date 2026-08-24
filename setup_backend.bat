@echo off
python "E:\Huffathul Hifaaz_asl\scaffold_fastapi.py"
cd "E:\Huffathul Hifaaz_asl\apps\backend-erp"
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
python init_db.py
echo "BACKEND SETUP COMPLETE"
