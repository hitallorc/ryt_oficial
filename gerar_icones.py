from PIL import Image
import os

input_image = "logo.png"

if os.path.exists(input_image):
    with Image.open(input_image) as img:
        # Garante o modo de cor correto
        img = img.convert("RGBA")
        
        # Filtro LANCZOS garante a maior qualidade possível no redimensionamento
        img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
        img_512.save("icon-512.png", format="PNG")
        print("✅ icon-512.png criado com sucesso!")

        img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
        img_192.save("icon-192.png", format="PNG")
        print("✅ icon-192.png criado com sucesso!")
else:
    print(f"Erro: Não encontrei o '{input_image}'. Salve a imagem gerada com este nome na mesma pasta.")