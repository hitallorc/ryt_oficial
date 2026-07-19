// cadastro.js

/**
 * Função principal para salvar o anúncio
 * Inclui: Validação, Moderação de IA e Integração Supabase
 */
async function salvarAnuncio() {
    const btn = document.getElementById('btnSalvar');
    const fileInput = document.getElementById('itemPhoto');
    const file = fileInput.files[0];

    // 1. OBRIGATORIEDADE DA FOTO
    if (!file) {
        alert("⚠️ A foto do produto é obrigatória para garantir a segurança e rastreabilidade.");
        return;
    }

    // Bloqueia o botão para evitar cliques duplicados
    btn.disabled = true;
    btn.innerText = "🤖 IA ANALISANDO IMAGEM...";

    try {
        // 2. MODERAÇÃO DE IA (GATEKEEPER)
        const base64Image = await toBase64(file);
        const isSafe = await moderarImagemIA(base64Image);

        if (!isSafe) {
            alert("❌ BLOQUEADO: A imagem viola nossas diretrizes (armas, drogas ou conteúdo impróprio).");
            btn.disabled = false;
            btn.innerText = "ANUNCIAR AGORA";
            return;
        }

        btn.innerText = "🚀 IA APROVOU! SUBINDO...";

        // 3. UPLOAD DA IMAGEM PARA O SUPABASE STORAGE
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        let { error: uploadError } = await supabaseClient.storage
            .from('item-photos')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Pega a URL pública da imagem
        const { data: { publicUrl } } = supabaseClient.storage
            .from('item-photos')
            .getPublicUrl(filePath);

        // 4. INSERÇÃO DOS DADOS NA TABELA ITEMS
        const { error: insertError } = await supabaseClient
            .from('items')
            .insert([{
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                daily_price: parseFloat(document.getElementById('price').value),
                city: document.getElementById('city').value,
                state_code: document.getElementById('state').value,
                address: document.getElementById('address').value,
                image_url: publicUrl,
                owner_id: user.id,
                is_active: true
            }]);

        if (insertError) throw insertError;

        alert("✅ Anúncio publicado com sucesso!");
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error("Erro no processo:", error.message);
        alert("Erro ao cadastrar: " + error.message);
        btn.disabled = false;
        btn.innerText = "ANUNCIAR AGORA";
    }
}

/**
 * FUNÇÃO DE IA: Comunica com o Gemini 1.5 Flash
 */
async function moderarImagemIA(base64Data) {
    // Busca a chave centralizada no seu config.js
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AIzaSyDVwEnpkvG-M2dmoFr5sC6i3jQesRiRhQo}`;
    
    const body = {
        contents: [{
            parts: [
                { text: "Analise esta imagem para um site de aluguel de itens. Se ela contiver armas, drogas, nudez ou violência, responda apenas 'N'. Se for um item legítimo (ferramenta, móvel, brinquedo, etc), responda apenas 'S'." },
                { inline_data: { mime_type: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const result = data.candidates[0].content.parts[0].text.trim().toUpperCase();
            return result.includes('S');
        }
        return false;
    } catch (err) {
        console.error("Falha na IA:", err);
        return false; // Por segurança, bloqueia se a IA falhar
    }
}

/**
 * HELPER: Converte arquivo para Base64 para a IA ler
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});