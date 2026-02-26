
const URL = "https://teachablemachine.withgoogle.com/models/yldRkSw1O/";

let model, labelContainer, maxPredictions;

// 모델 로드
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("모델 로드 완료");
    } catch (e) {
        console.error("모델 로딩 실패:", e);
    }
}

// 이미지 업로드 처리
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadArea = document.getElementById('upload-area');
const previewArea = document.getElementById('preview-area');
const resultArea = document.getElementById('result-area');
const retryButton = document.getElementById('retry-button');
const loading = document.getElementById('loading');
const labelText = document.getElementById('label-text');
const descriptionText = document.getElementById('description-text');
const predictionResult = document.getElementById('prediction-result');

imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        resultArea.style.display = 'block';
        loading.style.display = 'block';
        predictionResult.style.display = 'none';

        // 분류 시작 (이미지가 로드될 시간을 줌)
        imagePreview.onload = async () => {
            await predict();
        };
    };
    reader.readAsDataURL(file);
});

// 예측 수행
async function predict() {
    if (!model) await init();

    const prediction = await model.predict(imagePreview);
    
    // 가장 높은 확률의 클래스 찾기
    let topPrediction = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > topPrediction.probability) {
            topPrediction = prediction[i];
        }
    }

    loading.style.display = 'none';
    predictionResult.style.display = 'block';
    
    displayResult(topPrediction.className);
}

// 결과 출력 로직
function displayResult(className) {
    predictionResult.classList.remove('shell', 'olive');

    // 모델의 클래스 이름에 따라 결과 분기 (마늘 -> 포탄, 이야이야 올리브 -> 올리브 오일)
    // 모델의 정확한 클래스 명칭이 다를 수 있으므로 키워드로 매칭
    if (className.toLowerCase().includes('포탄') || className.toLowerCase().includes('shell') || className.toLowerCase().includes('bomb')) {
        labelText.innerText = "🚨 위험! 마늘향 포탄";
        descriptionText.innerText = "이것은 마늘향이 가득 실린 강력한 포탄입니다! 요리에 쓰지 마세요!";
        predictionResult.classList.add('shell');
    } else if (className.toLowerCase().includes('올리브') || className.toLowerCase().includes('olive')) {
        labelText.innerText = "🫒 최상급! 올리브 오일";
        descriptionText.innerText = "이야이야~ 정말 훌륭한 올리브 오일이군요! 샐러드에 딱입니다.";
        predictionResult.classList.add('olive');
    } else {
        labelText.innerText = `판별 결과: ${className}`;
        descriptionText.innerText = "음... 무엇인지 조금 더 자세히 보여주세요!";
    }
}

retryButton.addEventListener('click', () => {
    imageUpload.value = '';
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    resultArea.style.display = 'none';
});

// 초기화 호출
init();
