# TARKIZO

مؤقّت هادئ للدراسة والتركيز، بأربع لغات: العربية، Kurmancî، English، Deutsch.

موقع واحد بدون حساب وبدون قاعدة بيانات. كل الإعدادات والمهام والإحصائيات محفوظة على جهاز المستخدم فقط.

## الميزات

- **المؤقّت:** أوضاع جاهزة (بومودورو 25/5، 50/10، 90/15، 15/3) أو مخصصة بالدقائق والثواني، عدد دورات، عد تنازلي، إيقاف واستئناف، تخطٍّ، وإضافة دقيقة أو إنقاصها. يُحسب الوقت من وقت النهاية الفعلي، فيبقى دقيقًا في الخلفية، والجلسة تُستعاد بعد إعادة تحميل الصفحة.
- **شاشة التركيز:** الساعة فقط في منتصف الشاشة، أزرار تختفي تلقائيًا، وملء الشاشة.
- **المظهر:** 13 تصميمًا، منها «حديقة الورد» و«محرر الكود»، وستة أشكال للساعة، ووضع فاتح وداكن، وتخصيص الألوان.
- **الأصوات:** تسجيلات طبيعية حقيقية (مطر، رعد، طيور، أمواج، نهر، نار، مقهى، مكتبة، لوحة مفاتيح…) مع مزج ومستوى لكل صوت، وأصوات تنبيه، وتنبيه قبل نهاية الاستراحة.
- **المهام والتقدّم:** مهام بعدد جلسات مستهدف، ملخص يومي وأسبوعي وشهري، رسم بياني، هدف يومي، أيام متتالية، وتصدير البيانات واستيرادها.
- **تطبيق ويب:** يُثبَّت على الموبايل والكمبيوتر، ويعمل بدون إنترنت بعد أول زيارة.

## هيكل المشروع

```
index.html              الموقع كله (HTML وCSS وJavaScript في ملف واحد)
manifest.webmanifest    بيانات التطبيق عند التثبيت
sw.js                   service worker للعمل بدون إنترنت
icons/                  أيقونات التطبيق
sounds/                 التسجيلات الصوتية (انظر SOUNDS.md)
scripts/check.mjs       فحص تلقائي يشغّله CI
.github/workflows/      فحص ونشر تلقائي على GitHub Pages
```

## التشغيل على جهازك

لا يحتاج أي تثبيت. لكن الـ service worker وتحميل الأصوات يحتاجان سيرفرًا محليًا، ولا يعملان عند فتح الملف مباشرة:

```bash
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

للفحص قبل الرفع (يحتاج Node.js 18 أو أحدث):

```bash
node scripts/check.mjs
```

## النشر المجاني على GitHub Pages

1. أنشئ مستودعًا جديدًا على GitHub باسم `tarkizo` (عام، لأن GitHub Pages المجاني يحتاج مستودعًا عامًا).
2. ارفع الملفات:
   ```bash
   git init
   git add .
   git commit -m "TARKIZO v1"
   git branch -M main
   git remote add origin https://github.com/USERNAME/tarkizo.git
   git push -u origin main
   ```
3. في المستودع: **Settings ← Pages ← Build and deployment ← Source: GitHub Actions**.
4. افتح تبويب **Actions**: يعمل الفحص ثم النشر تلقائيًا. بعد دقيقة أو اثنتين يصبح الموقع على
   `https://USERNAME.github.io/tarkizo/`.

بعد ذلك، كل `git push` إلى `main` يُفحص ويُنشر تلقائيًا. إذا فشل الفحص لا يُنشر شيء.

## بديل: Cloudflare Pages

1. في Cloudflare: **Workers & Pages ← Create ← Pages ← Connect to Git** واختر المستودع.
2. Framework preset: **None**، Build command: اتركه فارغًا، Build output directory: `/`.
3. ملاحظة: نسخة الكاش في `sw.js` لا تتغير تلقائيًا هنا. غيّر `tarkizo-dev` يدويًا عند كل تحديث كبير، أو استخدم GitHub Pages.

## دومين خاص (اختياري، مدفوع)

الدومين مثل `tarkizo.com` يُشترى من مزوّد دومينات، ثم يُربط من **Settings ← Pages ← Custom domain**. الاستضافة نفسها تبقى مجانية.

---

## English

TARKIZO is a calm study and focus timer in Arabic, Kurmanji Kurdish, English and German. It is a single static page with no account and no backend: everything is stored in the browser.

- Run locally: `python3 -m http.server 8000`, then open `http://localhost:8000`.
- Check before pushing: `node scripts/check.mjs` (Node 18+).
- Deploy: push to `main` on GitHub, then set **Settings → Pages → Source: GitHub Actions**. The workflow checks the page and deploys it to GitHub Pages.

## License

Code: MIT (see `LICENSE`). Sound recordings: see `SOUNDS.md` (CC0 and Pixabay Content License).
