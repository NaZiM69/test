import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

# 1. إعداد الجهاز
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 2. تحميل أسماء الأصناف
try:
    with open('classes.txt', 'r') as f:
        class_names = [line.strip() for line in f.readlines()]
except FileNotFoundError:
    print("❌ خطأ: ملف classes.txt غير موجود في نفس المجلد!")
    exit()

# 3. بناء هيكل النموذج (نسخة Pro مع Dropout)
model = models.resnet50()
# يجب أن يتطابق الهيكل مع ما تم تدريبه في Colab
model.fc = nn.Sequential(
    nn.Dropout(p=0.4),
    nn.Linear(2048, 101)
)

# تحميل الأوزان
try:
    model.load_state_dict(torch.load('best_food101_pro.pth', map_location=device))
    print("✅ تم تحميل النموذج بنجاح!")
except Exception as e:
    print(f"❌ فشل تحميل الأوزان: {e}")
    exit()

model = model.to(device)
model.eval()

# 4. وظيفة التنبؤ
def predict_image(image_path):
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    if not os.path.exists(image_path):
        print(f"❌ لم يتم العثور على الصورة: {image_path}")
        return

    img = Image.open(image_path).convert('RGB')
    input_tensor = preprocess(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)[0]
    
    # جلب أفضل 3 نتائج
    top3_prob, top3_idx = torch.topk(probs, 3)

    print(f"\n📸 الصورة: {os.path.basename(image_path)}")
    print("-" * 30)
    for i in range(3):
        name = class_names[top3_idx[i].item()]
        score = top3_prob[i].item() * 100
        print(f"{i+1}. {name:<20} | الثقة: {score:.2f}%")

# 5. جرب الآن
test_img = "4.jpg" 
predict_image(test_img)