import os
from typing import Optional
from pypdf import PdfReader

class ResumeParser:
    """
    Parser for extracting text from resume files (PDF, TXT).
    """

    def extract_text(self, file_path: str) -> str:
        """
        Extracts text from a file based on its extension.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return self._extract_from_pdf(file_path)
        elif ext == ".txt":
            return self._extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    def _extract_from_pdf(self, file_path: str) -> str:
        """Extracts text from a PDF file."""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"Error parsing PDF: {e}")

    def _extract_from_txt(self, file_path: str) -> str:
        """Extracts text from a TXT file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except UnicodeDecodeError:
            # Try with different encoding if utf-8 fails
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read().strip()
        except Exception as e:
            raise Exception(f"Error reading TXT file: {e}")

if __name__ == "__main__":
    # Example usage
    parser = ResumeParser()
    # Create a dummy txt file for testing
    test_file = "test_resume.txt"
    with open(test_file, "w") as f:
        f.write("This is a test resume content.")
    
    try:
        content = parser.extract_text(test_file)
        print(f"Extracted content: {content}")
    finally:
        if os.path.exists(test_file):
            os.remove(test_file)
