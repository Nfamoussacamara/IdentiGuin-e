
import datetime

class MRZGenerator:
    """
    Générateur de Machine Readable Zone (MRZ) au format TD1 (3 lignes de 30 caractères).
    Conforme aux spécifications OACI pour les cartes d'identité.
    """

    @staticmethod
    def _calculate_check_digit(data: str) -> int:
        """Calcul du chiffre de contrôle MRZ (Poids 7, 3, 1)."""
        weights = [7, 3, 1]
        total = 0
        for i, char in enumerate(data):
            if char == '<':
                val = 0
            elif char.isdigit():
                val = int(char)
            elif char.isalpha():
                val = ord(char.upper()) - 55  # A=10, B=11...
            else:
                val = 0
            total += val * weights[i % 3]
        return total % 10

    @classmethod
    def generate_td1(cls, 
                     doc_number: str, 
                     birth_date: datetime.date, 
                     sex: str, 
                     expiry_date: datetime.date, 
                     nationality: str, 
                     last_name: str, 
                     first_names: str,
                     optional_data1: str = "",
                     optional_data2: str = "") -> list[str]:
        """
        Génère les 3 lignes MRZ pour une carte d'identité TD1.
        """
        # --- LIGNE 1 ---
        # Format: I<GIN[DocNumber][CheckDigit][OptionalData]
        doc_number = doc_number.replace(" ", "").upper()[:9].ljust(9, '<')
        check_doc = cls._calculate_check_digit(doc_number)
        
        opt1 = optional_data1.replace(" ", "").upper()[:15].ljust(15, '<')
        line1 = f"I<GIN{doc_number}{check_doc}{opt1}"

        # --- LIGNE 2 ---
        # Format: [BirthDate][Check][Sex][Expiry][Check][Nationality][OptionalData][CompositeCheck]
        s_birth = birth_date.strftime("%y%m%d")
        check_birth = cls._calculate_check_digit(s_birth)
        
        s_sex = sex.upper()[0] if sex else '<'
        if s_sex not in ['M', 'F']: s_sex = '<'
        
        s_expiry = expiry_date.strftime("%y%m%d")
        check_expiry = cls._calculate_check_digit(s_expiry)
        
        nat = nationality.upper()[:3].ljust(3, '<')
        opt2 = optional_data2.replace(" ", "").upper()[:11].ljust(11, '<')
        
        # Composite check digit (Line 1 doc number + Line 2 birth + Line 2 expiry + Line 2 optional data)
        composite_raw = f"{doc_number}{check_doc}{s_birth}{check_birth}{s_expiry}{check_expiry}{opt2}"
        composite_check = cls._calculate_check_digit(composite_raw)
        
        line2 = f"{s_birth}{check_birth}{s_sex}{s_expiry}{check_expiry}{nat}{opt2}{composite_check}"

        # --- LIGNE 3 ---
        # Format: LASTNAME<<FIRSTNAME<NAME<...
        last_name = last_name.replace(" ", "").upper()
        first_names = first_names.replace(" ", "<").upper()
        line3 = f"{last_name}<<{first_names}".ljust(30, '<')[:30]

        return [line1, line2, line3]
