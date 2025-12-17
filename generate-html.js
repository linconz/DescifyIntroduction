const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// 读取语言配置文件
const languagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'support_languages.json'), 'utf-8'));

// 语言代码到语言配置的映射
const languageConfig = {
    'zh-Hans': {
        lang: 'zh-Hans',
        title: 'Descify：AI 驱动的 Shopify 产品描述生成器',
        contactUs: '联系我们',
        copyright: '版权所有',
        nav: {
            home: '首页',
            product: '产品选择',
            history: '历史记录',
            contact: '联系我们'
        }
    },
    'zh-Hant': {
        lang: 'zh-Hant',
        title: 'Descify：AI 驅動的 Shopify 產品描述生成器',
        contactUs: '聯繫我們',
        copyright: '版權所有'
    },
    'ja': {
        lang: 'ja',
        title: 'Descify：AI駆動のShopify商品説明ジェネレーター',
        contactUs: 'お問い合わせ',
        copyright: '全著作権所有'
    },
    'ko': {
        lang: 'ko',
        title: 'Descify: AI 기반 Shopify 제품 설명 생성기',
        contactUs: '문의하기',
        copyright: '모든 권리 보유'
    },
    'fr': {
        lang: 'fr',
        title: 'Descify : Générateur de descriptions de produits Shopify alimenté par l\'IA',
        contactUs: 'Contactez-nous',
        copyright: 'Tous droits réservés'
    },
    'de': {
        lang: 'de',
        title: 'Descify: KI-gestützter Shopify Produktbeschreibungsgenerator',
        contactUs: 'Kontaktieren Sie uns',
        copyright: 'Alle Rechte vorbehalten'
    },
    'es': {
        lang: 'es',
        title: 'Descify: Generador de descripciones de productos de Shopify impulsado por IA',
        contactUs: 'Contáctenos',
        copyright: 'Todos los derechos reservados'
    },
    'pt': {
        lang: 'pt',
        title: 'Descify: Gerador de Descrições de Produtos Shopify com IA',
        contactUs: 'Entre em contato',
        copyright: 'Todos os direitos reservados'
    },
    'it': {
        lang: 'it',
        title: 'Descify: Generatore di descrizioni prodotti Shopify basato su IA',
        contactUs: 'Contattaci',
        copyright: 'Tutti i diritti riservati'
    },
    'ru': {
        lang: 'ru',
        title: 'Descify: Генератор описаний товаров Shopify на основе ИИ',
        contactUs: 'Свяжитесь с нами',
        copyright: 'Все права защищены'
    },
    'ar': {
        lang: 'ar',
        title: 'Descify: مولد وصف منتجات Shopify المدعوم بالذكاء الاصطناعي',
        contactUs: 'اتصل بنا',
        copyright: 'جميع الحقوق محفوظة'
    },
    'nl': {
        lang: 'nl',
        title: 'Descify: AI-aangedreven Shopify productbeschrijvingsgenerator',
        contactUs: 'Neem contact op',
        copyright: 'Alle rechten voorbehouden'
    },
    'pl': {
        lang: 'pl',
        title: 'Descify: Generator opisów produktów Shopify oparty na AI',
        contactUs: 'Skontaktuj się z nami',
        copyright: 'Wszelkie prawa zastrzeżone'
    },
    'tr': {
        lang: 'tr',
        title: 'Descify: Yapay Zeka Destekli Shopify Ürün Açıklama Oluşturucu',
        contactUs: 'Bize ulaşın',
        copyright: 'Tüm hakları saklıdır'
    },
    'sv': {
        lang: 'sv',
        title: 'Descify: AI-driven Shopify produktbeskrivningsgenerator',
        contactUs: 'Kontakta oss',
        copyright: 'Alla rättigheter förbehållna'
    },
    'da': {
        lang: 'da',
        title: 'Descify: AI-drevet Shopify produktbeskrivelsegenerator',
        contactUs: 'Kontakt os',
        copyright: 'Alle rettigheder forbeholdes'
    },
    'fi': {
        lang: 'fi',
        title: 'Descify: Tekoälyavusteinen Shopify tuotekuvausgeneraattori',
        contactUs: 'Ota yhteyttä',
        copyright: 'Kaikki oikeudet pidätetään'
    },
    'no': {
        lang: 'no',
        title: 'Descify: AI-drevet Shopify produktbeskrivelsegenerator',
        contactUs: 'Kontakt oss',
        copyright: 'Alle rettigheter reservert'
    },
    'th': {
        lang: 'th',
        title: 'Descify: เครื่องมือสร้างคำอธิบายผลิตภัณฑ์ Shopify ที่ขับเคลื่อนด้วย AI',
        contactUs: 'ติดต่อเรา',
        copyright: 'สงวนลิขสิทธิ์'
    }
};

// 获取所有语言目录
const localizeDir = path.join(__dirname, 'localize');
const languageDirs = fs.readdirSync(localizeDir)
    .filter(dir => {
        const fullPath = path.join(localizeDir, dir);
        return fs.statSync(fullPath).isDirectory() && dir !== '.DS_Store';
    });

console.log(`找到 ${languageDirs.length} 个语言目录：${languageDirs.join(', ')}\n`);

// 为每个语言生成 HTML
languageDirs.forEach(langCode => {
    const readmePath = path.join(localizeDir, langCode, 'README.md');

    // 检查 README.md 是否存在
    if (!fs.existsSync(readmePath)) {
        console.log(`⚠️  跳过 ${langCode}：未找到 README.md`);
        return;
    }

    // 读取 Markdown 文件
    let mdContent = fs.readFileSync(readmePath, 'utf-8');

    // 修正图片路径：将 images/ 替换为根路径 /images/
    mdContent = mdContent.replace(/images\//g, '/images/');

    // 移除 Markdown 中最后的版权信息行（避免重复）
    // 匹配各种语言的版权信息格式
    mdContent = mdContent.replace(/&copy;\s*2025\s+Descify.*?[.。]?\s*$/m, '');
    // 移除末尾多余的空行和 hr
    mdContent = mdContent.replace(/---\s*$/m, '').trim();

    // 将 Markdown 转换为 HTML
    let htmlContent = marked(mdContent);

    // 为关键章节添加 ID 锚点（用于导航）
    // 这些 ID 需要与各语言的标题匹配
    htmlContent = htmlContent.replace(/<h3>1\.(.*?)<\/h3>/, '<h3 id="section-home">1.$1</h3>');
    htmlContent = htmlContent.replace(/<h3>2\.(.*?)<\/h3>/, '<h3 id="section-product">2.$1</h3>');
    htmlContent = htmlContent.replace(/<h3>3\.(.*?)<\/h3>/, '<h3 id="section-history">3.$1</h3>');

    // 获取语言配置
    const config = languageConfig[langCode] || {
        lang: langCode,
        title: 'Descify: AI-Powered Shopify Product Description Generator',
        contactUs: 'Contact us',
        copyright: 'All rights reserved',
        nav: {
            home: 'Home Page',
            product: 'Product Selection',
            history: 'History',
            contact: 'Contact Us'
        }
    };

    // 确保所有语言都有 nav 配置
    if (!config.nav) {
        config.nav = {
            home: 'Home Page',
            product: 'Product Selection',
            history: 'History',
            contact: 'Contact Us'
        };
    }

    // 生成语言切换器 HTML
    const languageSwitcher = languagesData.map(lang => {
        const isCurrentLang = lang.code === langCode || (langCode === 'en' && lang.code === 'en');
        const href = lang.path === '/' ? '/index.html' : `${lang.path}index.html`;
        const className = isCurrentLang ? 'lang-option current' : 'lang-option';
        return `<a href="${href}" class="${className}">${lang.native}</a>`;
    }).join('\n                ');

    // HTML 模板
    const htmlTemplate = `<!DOCTYPE html>
<html lang="${config.lang}" prefix="og: http://ogp.me/ns#">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Descify is a comprehensive Shopify application designed to automate and optimize the copywriting process for e-commerce merchants using advanced AI.">
    <meta name="keywords"
        content="Shopify App, AI Product Description, Ecommerce Copywriting, SEO, Descify, Shopify Automation, Product Content Generator">
    <meta name="author" content="GetBestify">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.getbestify.com/">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.getbestify.com/">
    <meta property="og:title" content="${config.title}">
    <meta property="og:description"
        content="Descify is a comprehensive Shopify application designed to automate and optimize the copywriting process for e-commerce merchants using advanced AI.">
    <meta property="og:image" content="/images/1.%20Home%20Page.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.getbestify.com/">
    <meta property="twitter:title" content="${config.title}">
    <meta property="twitter:description"
        content="Descify is a comprehensive Shopify application designed to automate and optimize the copywriting process for e-commerce merchants using advanced AI.">
    <meta property="twitter:image" content="/images/1.%20Home%20Page.png">

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Descify",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Shopify",
        "offers": [
            {
                "@type": "Offer",
                "name": "Free Plan",
                "description": "10 credits per month, Batch create 3 products, 1 saved version per product, Supports 20 languages, Multiple product template styles.",
                "price": "0",
                "priceCurrency": "USD",
                "url": "https://apps.shopify.com/descify-app-link/free-plan",
                "availability": "https://schema.org/InStock",
                "businessFunction": "https://schema.org/Free"
            },
            {
                "@type": "Offer",
                "name": "Basic Plan",
                "description": "1,000 credits per month, Unlimited products per batch, 3 saved versions per product, Supports 20 languages, Multiple product template styles, Email customer support.",
                "price": "5.99",
                "priceCurrency": "USD",
                "url": "https://apps.shopify.com/descify-app-link/basic-plan-checkout",
                "availability": "https://schema.org/InStock",
                "businessFunction": "https://schema.org/Sell",
                "billingIncrement": 1,
                "billingDuration": "P1M"
            },
            {
                "@type": "Offer",
                "name": "Premium Plan",
                "description": "2,000 credits per month, Unlimited products per batch, 10 saved versions per product, Supports 20 languages, Multiple product template styles, Email customer support.",
                "price": "7.99",
                "priceCurrency": "USD",
                "url": "https://apps.shopify.com/descify-app-link/premium-plan-checkout",
                "availability": "https://schema.org/InStock",
                "businessFunction": "https://schema.org/Sell",
                "billingIncrement": 1,
                "billingDuration": "P1M"
            }
        ],
        "publisher": {
            "@type": "Organization",
            "name": "GetBestify",
            "url": "https://www.getbestify.com/"
        },
        "description": "Descify is a comprehensive Shopify application designed to automate and optimize the copywriting process for e-commerce merchants.",
        "featureList": "AI Product Descriptions, SEO Optimization, Multi-language Support, Bulk Generation",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
        },
        "review": [
            {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
            },
            "author": {
                "@type": "Person",
                "name": "Sarah L."
            },
            "reviewBody": "As a dropshipper with hundreds of products, the Bulk Generation feature is a game-changer. Descriptions are SEO-friendly right out of the box."
            },
            {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
            },
            "author": {
                "@type": "Person",
                "name": "Mark Chen"
            },
            "reviewBody": "Great value for the Basic plan. It significantly reduced the time spent on copywriting. I wish the multi-language support was a bit smoother, but overall highly effective."
            },
            {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
            },
            "author": {
                "@type": "Person",
                "name": "Jessica R."
            },
            "reviewBody": "Finally, an AI tool that understands e-commerce intent! The multiple product template styles let me easily match descriptions to my brand voice. Highly recommend the Premium tier."
            }
        ]
    }
    </script>

    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">
    <style>
        body {
            background-color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        }

        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            position: relative; /* 添加相对定位，使语言切换器相对于此容器定位 */
        }

        .markdown-body img {
            max-width: 100%;
            border-style: none;
            /* Ensure no border on images */
            /* Add some spacing for images */
            margin-top: 10px;
            margin-bottom: 10px;
        }

        /* Center aligned images div fix */
        div[align="center"] {
            text-align: center;
        }

        @media (max-width: 767px) {
            .markdown-body {
                padding: 15px;
            }
        }

        /* Add a footer style */
        footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            padding-top: 20px;
            border-top: 1px solid #eaecef;
        }

        /* Language switcher styles */
        .language-switcher {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1000;
        }

        .lang-toggle {
            background: #f6f8fa;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: background 0.2s;
        }

        .lang-toggle:hover {
            background: #eaeef2;
        }

        .lang-toggle::after {
            content: '▼';
            font-size: 10px;
        }

        .lang-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
            min-width: 180px;
            max-height: 400px;
            overflow-y: auto;
            padding: 4px 0;
        }

        .language-switcher:hover .lang-dropdown {
            display: block;
        }

        .lang-option {
            display: block;
            padding: 8px 16px;
            color: #24292f;
            text-decoration: none;
            font-size: 14px;
            transition: background 0.2s;
        }

        .lang-option:hover {
            background: #f6f8fa;
        }

        .lang-option.current {
            background: #ddf4ff;
            color: #0969da;
            font-weight: 600;
        }

        @media (max-width: 767px) {
            .language-switcher {
                top: 10px;
                right: 10px;
            }

            .lang-toggle {
                padding: 6px 10px;
                font-size: 13px;
            }

            .lang-dropdown {
                max-height: 300px;
                min-width: 150px;
            }
        }

        /* Back to top button styles */
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #0969da;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(9, 105, 218, 0.3);
            transition: all 0.3s ease;
            z-index: 999;
        }

        .back-to-top:hover {
            background: #0550ae;
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(9, 105, 218, 0.4);
        }

        .back-to-top.show {
            display: flex;
        }

        @media (max-width: 767px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 18px;
            }
        }

        /* Side navigation styles */
        .side-nav {
            position: fixed;
            top: 100px; /* 与 article 的 padding-top 对齐 */
            right: max(calc((100vw - 980px) / 2 - 180px), 20px);
            background: white;
            border: 1px solid #d0d7de;
            border-radius: 8px;
            padding: 16px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 998;
            min-width: 160px;
        }

        .side-nav-title {
            padding: 0 16px 12px;
            font-size: 12px;
            font-weight: 600;
            color: #656d76;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #d0d7de;
            margin-bottom: 8px;
        }

        .side-nav-item {
            display: block;
            padding: 8px 16px;
            color: #24292f;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }

        .side-nav-item:hover {
            background: #f6f8fa;
            color: #0969da;
        }

        .side-nav-item.active {
            background: #ddf4ff;
            color: #0969da;
            border-left-color: #0969da;
            font-weight: 600;
        }

        @media (max-width: 1400px) {
            .side-nav {
                display: none;
            }
        }
    </style>
</head>

<body>
    <article class="markdown-body">
        <div class="language-switcher">
            <div class="lang-toggle">${config.lang === 'en' ? 'English' : languagesData.find(l => l.code === langCode)?.native || config.lang}</div>
            <div class="lang-dropdown">
                ${languageSwitcher}
            </div>
        </div>
${htmlContent}
<p id="contact">${config.contactUs}: contact@getbestify.com</p>
<p>&copy; 2025 Descify powered by Getbestify. ${config.copyright}.</p>

    </article>

    <!-- Side navigation -->
    <nav class="side-nav" id="sideNav">
        <div class="side-nav-title">Navigation</div>
        <a href="#section-home" class="side-nav-item" data-section="section-home">${config.nav.home}</a>
        <a href="#section-product" class="side-nav-item" data-section="section-product">${config.nav.product}</a>
        <a href="#section-history" class="side-nav-item" data-section="section-history">${config.nav.history}</a>
        <a href="#contact" class="side-nav-item" data-section="contact">${config.nav.contact}</a>
    </nav>

    <!-- Back to top button -->
    <button class="back-to-top" id="backToTop" aria-label="Back to top">↑</button>

    <script>
        // Back to top functionality
        const backToTopButton = document.getElementById('backToTop');
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Side navigation scroll highlight
        const navItems = document.querySelectorAll('.side-nav-item');
        const sections = ['section-home', 'section-product', 'section-history', 'contact'];
        
        function updateActiveNav() {
            let currentSection = '';
            const scrollPosition = window.pageYOffset + 100;
            
            // Find current section
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = sectionId;
                    }
                }
            });
            
            // Update active state
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.section === currentSection) {
                    item.classList.add('active');
                }
            });
        }
        
        // Update on scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Update on load
        updateActiveNav();
        
        // Smooth scroll for nav links
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 20,
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
</body>

</html>`;

    // 写入 HTML 文件
    const outputPath = path.join(localizeDir, langCode, 'index.html');
    fs.writeFileSync(outputPath, htmlTemplate, 'utf-8');

    console.log(`✅ ${langCode}: HTML 文件已生成`);
});

console.log(`\n🎉 完成！共生成 ${languageDirs.length} 个 HTML 文件`);
