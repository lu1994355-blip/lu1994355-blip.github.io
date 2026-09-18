import{j as s}from"./vendor-motion-xEM_j57B.js";import{r as n}from"./vendor-react-C9hsovHu.js";const t=()=>(n.useEffect(()=>{const e=document.createElement("link");e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap",document.head.appendChild(e);const a=document.createElement("link");a.rel="stylesheet",a.href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,700;1,700&display=swap",document.head.appendChild(a);const i=document.createElement("link");return i.rel="stylesheet",i.href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",document.head.appendChild(i),()=>{document.head.removeChild(e),document.head.removeChild(a),document.head.removeChild(i)}},[]),s.jsxs(s.Fragment,{children:[s.jsx("style",{children:`
        /* Reset for this page scope */
        .ss-page, .ss-page *, .ss-page *::before, .ss-page *::after {
          box-sizing: border-box;
        }
        .ss-page {
          font-family: 'Noto Sans JP', sans-serif;
          line-height: 1;
          color: #151515;
          font-size: 20px;
          font-weight: bold;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
        .ss-page h1, .ss-page h2, .ss-page h3, .ss-page h4, .ss-page h5, .ss-page h6,
        .ss-page p, .ss-page ul, .ss-page ol, .ss-page li, .ss-page dl, .ss-page dt, .ss-page dd,
        .ss-page div, .ss-page span, .ss-page section, .ss-page header, .ss-page footer, .ss-page main,
        .ss-page figure, .ss-page figcaption, .ss-page article, .ss-page aside {
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;
          font-size: 100%;
          vertical-align: baseline;
          background: transparent;
        }
        .ss-page p {
          line-height: 1.6;
        }
        .ss-page img {
          width: 100%;
          max-width: 100%;
          vertical-align: bottom;
        }
        .ss-page a {
          margin: 0;
          padding: 0;
          font-size: 100%;
          vertical-align: baseline;
          background: transparent;
          text-decoration: none;
        }
        .ss-page li {
          list-style: none;
        }
        .ss-page .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
          display: inline-flex;
          vertical-align: middle;
        }
        .ss-page .ss-sp { display: none; }
        .ss-page .ss-pc { display: block; }

        /* Header */
        .ss-page .ss-header {
          display: flex;
          align-items: center;
          max-width: 1200px;
          margin: 50px auto 0;
          gap: 30px;
        }
        .ss-page .ss-logo { width: 384px; }
        .ss-page .ss-fv-img { width: 710px; border-radius: 16px; object-fit: cover; }

        /* FV Bottom */
        .ss-page .ss-fv-bottom {
          border-radius: 10px;
          max-width: 1200px;
          margin: 20px auto 0;
          border: 5px solid #339CD0;
          position: relative;
          padding: 56px 35px 40px;
        }
        .ss-page .ss-under-line {
          background: linear-gradient(transparent 70%, #FFDC72 0%);
          line-height: 1;
        }
        .ss-page .ss-fv-bottom h1 {
          position: absolute;
          left: 0;
          right: 0;
          top: -30px;
          margin: auto;
          line-height: 60px;
          color: #fff;
          background: #339CD0;
          border-radius: 30px;
          width: calc(100% - 100px);
          text-align: center;
          font-size: 28px;
          font-weight: 900;
        }

        /* Curve sections */
        .ss-page .ss-curve-top {
          margin-top: 50px;
          width: 100%;
          height: 120px;
          border-radius: 50%;
          background-color: #ECF6FB;
        }
        .ss-page .ss-curve-bottom {
          position: relative;
          z-index: 1;
          margin-top: -60px;
          width: 100%;
          height: 120px;
          border-radius: 50%;
          background-color: #ECF6FB;
        }

        /* Service List Wrap */
        .ss-page .ss-service-list-wrap {
          position: relative;
          z-index: 2;
          background: #ECF6FB;
          margin-top: -60px;
          padding: 30px 0 60px;
        }
        .ss-page .ss-bg-blue {
          width: 58%;
          height: 722px;
          background-color: #E2F1F8;
          border-radius: 0 300px 300px 0;
        }
        .ss-page .ss-bg-green {
          width: 58%;
          height: 722px;
          background-color: #EAF6F0;
          border-radius: 300px 0 0 300px;
        }
        .ss-page .ss-bg-dot {
          width: 800px;
          height: 800px;
          background-image: radial-gradient(circle, #e5e5e5 2.5px, transparent 2.5px);
          background-position: 0 0;
          background-size: 10px 10px;
        }
        .ss-page .ss-bg-1 { position: absolute; top: 12%; left: 0; }
        .ss-page .ss-bg-2 { position: absolute; top: 35%; right: 0; }
        .ss-page .ss-bg-3 { position: absolute; bottom: 12%; left: 0; }
        .ss-page .ss-bg-dot-1 { position: absolute; top: 4%; right: 7%; }
        .ss-page .ss-bg-dot-2 { position: absolute; top: 40%; left: 3%; }
        .ss-page .ss-bg-dot-3 { position: absolute; bottom: 5%; right: 0; }

        /* Service List */
        .ss-page .ss-service-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 36px 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .ss-page .ss-service-list li {
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 35px;
          border-radius: 10px;
          background: #fff;
          box-shadow: 5px 5px 0 #B1D9ED;
        }
        .ss-page .ss-service-list li h3 {
          color: #339CD0;
          margin-bottom: 25px;
          font-size: 26px;
          font-weight: 900;
        }
        .ss-page .ss-service-list .ss-h3-after {
          font-family: "Rubik", sans-serif;
          font-weight: 700;
          font-style: normal;
          color: #20A464;
          font-size: 12px;
          vertical-align: top;
          margin-left: 10px;
        }
        .ss-page .ss-service-list li p {
          margin-bottom: 20px;
        }
        .ss-page .ss-service-list li img {
          margin-top: auto;
          border-radius: 10px;
        }

        /* Icons */
        .ss-page .ss-travel-icon {
          width: 190px;
          position: absolute;
          top: -40px;
          right: -150px;
        }
        .ss-page .ss-gourmet-icon {
          width: 180px;
          position: absolute;
          bottom: 80px;
          left: -158px;
        }
        .ss-page .ss-health-icon {
          width: 168px;
          position: absolute;
          top: 150px;
          right: -270px;
        }
        .ss-page .ss-beauty-icon {
          width: 85px;
          position: absolute;
          top: -130px;
          left: -120px;
        }
        .ss-page .ss-lifeplanning-icon {
          width: 104px;
          position: absolute;
          top: -50px;
          left: -200px;
        }
        .ss-page .ss-repair-icon {
          width: 136px;
          position: absolute;
          top: -55px;
          right: -120px;
        }

        /* Icon Animations */
        .ss-page .ss-icon-anime {
          animation: ss-iconanime 2s ease-in-out infinite;
        }
        @keyframes ss-iconanime {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        .ss-page .ss-icon-anime2 {
          animation: ss-iconanime2 2s ease-in-out infinite;
        }
        @keyframes ss-iconanime2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }

        /* QA Section */
        .ss-page .ss-sec-qa {
          background: #EAF6F0;
          margin-top: -60px;
          padding: 110px 0 80px;
        }
        .ss-page .ss-sec-qa h2 {
          color: #20A464;
          font-size: 30px;
          text-align: center;
          margin-bottom: 50px;
        }
        .ss-page .ss-sec-qa h2::after {
          content: '';
          display: block;
          width: 350px;
          height: 304px;
          margin: 20px auto 0;
          background: url(/support-selection/qanda.svg) no-repeat center / contain;
        }
        .ss-page .ss-qa-cont {
          max-width: 1000px;
          margin: 0 auto 36px;
          box-shadow: 0 0 0 3px #20A464;
          border-radius: 10px;
          background: #fff;
        }
        .ss-page .ss-qa-cont:last-child {
          margin-bottom: 0;
        }
        .ss-page .ss-qa-cont input {
          display: none;
        }
        .ss-page .ss-qa-cont label {
          display: block;
          position: relative;
          padding: 30px 80px 30px 90px;
          cursor: pointer;
        }
        .ss-page .ss-qa-cont label::before {
          content: 'Q';
          position: absolute;
          top: 5px;
          bottom: 5px;
          left: 46px;
          margin: auto;
          height: fit-content;
          font-family: "Rubik", sans-serif;
          font-size: 26px;
          color: #20A464;
        }
        .ss-page .ss-qa-cont .ss-plus {
          display: block;
          width: 20px;
          height: 20px;
          position: absolute;
          right: 46px;
          top: 0;
          bottom: 0;
          margin: auto;
        }
        .ss-page .ss-qa-cont .ss-plus span {
          display: block;
          width: 100%;
          height: 100%;
        }
        .ss-page .ss-qa-cont .ss-plus span::before,
        .ss-page .ss-qa-cont .ss-plus span::after {
          content: '';
          display: block;
          width: 100%;
          height: 3px;
          background: #20A464;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
        .ss-page .ss-qa-cont .ss-plus span::after {
          transform: rotate(90deg);
          transition: transform 0.3s;
        }
        .ss-page .ss-qa-cont:has(input:checked) .ss-plus span::after {
          transform: rotate(0deg);
        }
        .ss-page .ss-answer-wrap {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s;
          padding: 0 50px 0 90px;
          position: relative;
        }
        .ss-page .ss-qa-cont:has(input:checked) .ss-answer-wrap {
          max-height: 100vh;
        }
        .ss-page .ss-answer-wrap::before {
          content: 'A';
          position: absolute;
          top: 3px;
          left: 46px;
          font-family: "Rubik", sans-serif;
          font-size: 26px;
          color: #20A464;
        }
        .ss-page .ss-answer-wrap-in {
          margin-bottom: 30px;
        }
        .ss-page .ss-flex {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .ss-page .ss-answer-wrap p {
          font-size: 16px;
          font-weight: 400;
        }
        .ss-page .ss-answer-wrap-in .ss-gray {
          background: #F8F8F8;
          border-radius: 20px;
          padding: 30px;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex {
          display: flex;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex .ss-gray-inner-flex-item-a,
        .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex .ss-gray-inner-flex-item-b {
          flex-grow: 1;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex .ss-gray-inner-flex-item-a {
          position: relative;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex .ss-gray-inner-flex-item-a::after {
          position: absolute;
          top: 0;
          left: 100%;
          content: "";
          width: 1px;
          height: 100%;
          background-color: #B1D9ED;
        }
        .ss-page .ss-answer-wrap-in .ss-gray h4 {
          margin-bottom: 25px;
          font-size: 26px;
          font-weight: 900;
          text-align: center;
        }
        .ss-page .ss-answer-wrap-in .ss-gray h5 {
          text-align: center;
          margin-bottom: 15px;
          font-weight: 900;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-ul {
          width: 50%;
          margin: auto;
        }
        .ss-page .ss-answer-wrap-in .ss-gray ul li {
          font-size: 14px;
          font-weight: 400;
          text-indent: -16px;
          padding-left: 16px;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-ul {
          text-align: center;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-link,
        .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-link {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-link::before {
          width: 50px;
          height: 50px;
          content: '';
          background-image: url('/support-selection/mail.svg');
          background-repeat: no-repeat;
          background-size: contain;
          flex-shrink: 0;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-link a {
          font-family: "Rubik", sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin-left: 10px;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-recp-hours,
        .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-recp-hours {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: 900;
          text-align: center;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-link::before {
          width: 50px;
          height: 50px;
          content: '';
          background-image: url('/support-selection/phone.svg');
          background-repeat: no-repeat;
          background-size: contain;
          flex-shrink: 0;
        }
        .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-link a {
          font-family: "Rubik", sans-serif;
          font-size: 30px;
          font-weight: 700;
          margin-left: 10px;
        }
        .ss-page .ss-answer-wrap a {
          color: #339CD0;
          border-bottom: 1px solid #339CD0;
          padding-bottom: 3px;
          font-weight: 700;
        }
        .ss-page .ss-nenmatsu {
          font-size: 14px;
          font-weight: 400;
        }

        /* Company Section */
        .ss-page .ss-sec-company {
          position: relative;
          z-index: 0;
          background: #E2F1F8;
          padding: 60px 0 0;
        }
        .ss-page .ss-sec-company::before {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: -1;
          content: '';
          display: block;
          width: calc(100% - 100px);
          height: calc(100% - 60px);
          background-color: #ffffff;
          border-radius: 300px 0 0 0;
        }
        .ss-page .ss-bg-dot-4 {
          position: absolute;
          top: -30px;
          left: 0;
          z-index: -2;
          width: 800px;
          height: 400px;
          background-image: radial-gradient(circle, #e5e5e5 2.5px, transparent 2.5px);
          background-position: 0 0;
          background-size: 10px 10px;
        }
        .ss-page .ss-company-overview-in {
          max-width: 750px;
          margin: 0 auto;
          padding: 60px 100px 60px;
        }
        .ss-page .ss-company-overview-in h2 {
          margin-right: 20px;
          color: #339CD0;
          font-size: 30px;
          text-align: center;
        }
        .ss-page .ss-company-overview-in dl {
          display: flex;
          font-size: 16px;
          margin-top: 50px;
        }
        .ss-page .ss-company-overview-in dt {
          width: 20%;
          color: #339CD0;
        }
        .ss-page .ss-company-overview-in dd {
          width: 80%;
          font-weight: 400;
        }
        .ss-page .ss-company-overview-in dd ul {
          margin-top: 14px;
          padding-left: 0;
          line-height: 1.8;
        }
        .ss-page .ss-company-overview-in dl dd ul li {
          list-style-type: disc;
          list-style-position: inside;
          font-size: 14px;
          text-indent: -20px;
          padding-left: 20px;
        }
        .ss-page .ss-company-overview-in dl dd ul li:nth-child(odd)::marker {
          color: #339CD0;
        }
        .ss-page .ss-company-overview-in dl dd ul li:nth-child(even)::marker {
          color: #20A464;
        }

        /* Footer */
        .ss-page .ss-footer {
          background: transparent linear-gradient(90deg, #339CD0 0%, #20A464 100%) 0% 0% no-repeat padding-box;
          padding: 20px 0;
          text-align: center;
        }
        .ss-page .ss-footer span {
          color: #339CD0;
          background: #fff;
          border-radius: 30px;
          font-size: 12px;
          padding: 5px 30px;
          margin-bottom: 16px;
          display: inline-block;
        }
        .ss-page .ss-footer a {
          color: #FFF;
          font-size: 12px;
          margin-bottom: 16px;
          display: inline-block;
        }
        .ss-page .ss-footer .ss-copy {
          font-size: 12px;
          color: #fff;
          font-weight: 300;
        }

        /* ============ SP ============ */
        @media screen and (max-width: 768px) {
          .ss-page {
            font-size: 16px;
          }
          .ss-page p {
            line-height: 1.5;
          }
          .ss-page .ss-sp { display: block; }
          .ss-page .ss-pc { display: none; }
          .ss-page .ss-header {
            margin: 30px 5% 0;
            display: block;
          }
          .ss-page .ss-header .ss-logo {
            height: 50px;
            width: auto;
            margin-bottom: 30px;
          }
          .ss-page .ss-header .ss-fv-img {
            padding-right: 10px;
            padding-left: 10px;
            width: 100%;
            border-radius: 12px;
          }
          .ss-page .ss-fv-bottom {
            margin: 0 5% 0;
            padding: 0 0 0;
            border: none;
          }
          .ss-page .ss-fv-bottom h1 {
            position: static;
            padding: 10px 20px 5px;
            line-height: 1.5;
            border-radius: 10px 10px 0 0;
            width: 100%;
            font-size: 18px;
            text-align: left;
          }
          .ss-page .ss-fv-bottom p {
            padding: 10px 15px 15px;
            border: 5px solid #339CD0;
            border-radius: 0 0 10px 10px;
          }
          .ss-page .ss-curve-top {
            margin-top: 30px;
          }
          .ss-page .ss-service-list-wrap {
            padding: 0;
          }
          .ss-page .ss-service-list {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 0 5%;
          }
          .ss-page .ss-service-list li {
            padding: 20px;
          }
          .ss-page .ss-service-list li h3,
          .ss-page .ss-service-list li p {
            margin-bottom: 15px;
          }
          .ss-page .ss-travel-icon {
            width: 95px;
            top: -75px;
            right: 55%;
          }
          .ss-page .ss-gourmet-icon {
            width: 85px;
            top: -75px;
            left: 55%;
          }
          .ss-page .ss-sec-qa {
            padding: 80px 0 30px;
          }
          .ss-page .ss-sec-qa h2 {
            font-size: 26px;
            margin-bottom: 30px;
          }
          .ss-page .ss-sec-qa h2::after {
            width: 250px;
            height: 218px;
          }
          .ss-page .ss-qa-cont {
            margin: 0 5% 25px;
          }
          .ss-page .ss-qa-cont label {
            padding: 15px 50px 15px 50px;
          }
          .ss-page .ss-qa-cont label::before {
            left: 20px;
            font-size: 20px;
          }
          .ss-page .ss-qa-cont h3 {
            line-height: 1.5;
          }
          .ss-page .ss-qa-cont .ss-plus {
            right: 20px;
          }
          .ss-page .ss-answer-wrap {
            padding: 0 50px 0 50px;
          }
          .ss-page .ss-answer-wrap::before {
            left: 20px;
            font-size: 20px;
          }
          .ss-page .ss-flex,
          .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex {
            flex-direction: column;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex {
            gap: 30px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray {
            width: 100%;
            padding: 15px 15px 20px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray h4 {
            margin-bottom: 15px;
            font-size: 18px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray h5 {
            font-size: 18px;
            margin-top: 10px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-link,
          .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-link {
            margin-bottom: 15px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-recp-hours,
          .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-recp-hours {
            margin-bottom: 15px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-link::before,
          .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-link::before {
            width: 25px;
            height: 25px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-link a {
            font-size: 10px;
            margin-left: 5px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-tel-link a {
            font-size: 20px;
            margin-left: 5px;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-mail-ul {
            width: 100%;
          }
          .ss-page .ss-answer-wrap-in .ss-gray .ss-gray-inner-flex .ss-gray-inner-flex-item-a::after {
            top: 100%;
            left: 0;
            width: 100%;
            height: 1px;
            margin: 20px 0;
          }
          .ss-page .ss-sec-company {
            padding: 30px 0 0;
          }
          .ss-page .ss-sec-company::before {
            height: calc(100% - 30px);
            width: calc(100% - 20px);
            border-radius: 50px 0 0 0;
          }
          .ss-page .ss-company-overview-in {
            padding: 30px 20px 30px 50px;
          }
          .ss-page .ss-company-overview-in dl {
            flex-direction: column;
            margin-top: 30px;
          }
          .ss-page .ss-company-overview-in dt,
          .ss-page .ss-company-overview-in dd {
            width: 100%;
          }
          .ss-page .ss-company-overview-in dt {
            margin-bottom: 15px;
          }
        }

        /* Tablet */
        @media screen and (min-width: 769px) and (max-width: 1200px) {
          .ss-page .ss-fv-bottom,
          .ss-page .ss-service-list,
          .ss-page .ss-qa-cont {
            margin-left: 20px;
            margin-right: 20px;
          }
          .ss-page .ss-fv-bottom h1 {
            font-size: 20px;
          }
          .ss-page .ss-travel-icon { right: -230px; }
          .ss-page .ss-gourmet-icon { left: -230px; }
          .ss-page .ss-repair-icon { right: -160px; }
          .ss-page .ss-sec-company::before {
            border-radius: 100px 0 0 0;
          }
        }
      `}),s.jsxs("div",{className:"ss-page",children:[s.jsxs("header",{className:"ss-header",children:[s.jsx("img",{src:"/support-selection/supportselection-logo.svg",alt:"サポートセレクション",className:"ss-logo"}),s.jsx("img",{src:"/support-selection/supportselection-fv.webp",alt:"サポートセレクションメインイメージ",className:"ss-fv-img"})]}),s.jsxs("main",{children:[s.jsxs("section",{children:[s.jsxs("div",{className:"ss-fv-bottom",children:[s.jsx("h1",{children:"サポートセレクション(サポセレ)で多種多様なサービスが使い放題！"}),s.jsxs("p",{children:[s.jsx("span",{className:"ss-under-line",children:"サポートセレクション(サポセレ)"}),"とは…",s.jsx("br",{}),"飲食店やレジャー施設をお得に利用できたり、ボディメンテナンスや資産形成の相談を手軽に受けて頂けるサポートサービスです。",s.jsx("br",{className:"ss-sp"}),"また、生活機器のトラブルや近隣騒音など、生活の「困った」にも寄り添います。"]})]}),s.jsx("div",{className:"ss-curve-top"}),s.jsxs("div",{className:"ss-service-list-wrap",children:[s.jsx("div",{className:"ss-travel-icon ss-sp",children:s.jsx("img",{src:"/support-selection/travel.svg",alt:"",className:"ss-icon-anime"})}),s.jsx("div",{className:"ss-gourmet-icon ss-sp",children:s.jsx("img",{src:"/support-selection/gourmet.svg",alt:"",className:"ss-icon-anime2"})}),s.jsx("div",{className:"ss-bg-blue ss-bg-1 ss-pc"}),s.jsx("div",{className:"ss-bg-green ss-bg-2 ss-pc"}),s.jsx("div",{className:"ss-bg-blue ss-bg-3 ss-pc"}),s.jsx("div",{className:"ss-bg-dot ss-bg-dot-1 ss-pc"}),s.jsx("div",{className:"ss-bg-dot ss-bg-dot-2 ss-pc"}),s.jsx("div",{className:"ss-bg-dot ss-bg-dot-3 ss-pc"}),s.jsxs("ul",{className:"ss-service-list",children:[s.jsxs("li",{children:[s.jsxs("h3",{children:["グルメ",s.jsx("span",{className:"ss-h3-after",children:"/ GOURMET"})]}),s.jsxs("p",{children:["お近くの飲食店、有名レストランなど、全国のグルメストアをお得に利用することができます。",s.jsx("br",{}),"利用回数などの制限を気にする必要もありません。"]}),s.jsx("img",{src:"/support-selection/gourmet-img.jpg",alt:"グルメ"}),s.jsx("div",{className:"ss-gourmet-icon ss-pc",children:s.jsx("img",{src:"/support-selection/gourmet.svg",alt:"グルメイラスト",className:"ss-icon-anime"})})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["リゾート・トラベル",s.jsx("span",{className:"ss-h3-after",children:"/ TRAVEL"})]}),s.jsxs("p",{children:["日本全国にあるリゾートホテルや旅館を、割安価格で見つけることができます。",s.jsx("br",{}),"5つ星ホテルはもちろん、宿泊付きツアーも用意されています。"]}),s.jsx("img",{src:"/support-selection/travel-img.jpg",alt:"リゾート・トラベル"}),s.jsx("div",{className:"ss-travel-icon ss-pc",children:s.jsx("img",{src:"/support-selection/travel.svg",alt:"リゾート・トラベルイラスト",className:"ss-icon-anime2"})})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["レジャー",s.jsx("span",{className:"ss-h3-after",children:"/ LEISURE"})]}),s.jsxs("p",{children:["映画やカラオケ、テーマパーク、スポーツ観戦など、日常を楽しくする施設やサービスをお得に利用出来ます。",s.jsx("br",{}),"人気のレジャーを楽しめます。"]}),s.jsx("img",{src:"/support-selection/leisure-img.jpg",alt:"レジャー"})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["健康",s.jsx("span",{className:"ss-h3-after",children:"/ HEALTH"})]}),s.jsxs("p",{children:["健康関連商品の優待割引サービスやオンライン診療を受診できます。",s.jsx("br",{}),"自宅にいながら健康メンテナンスをご利用可能です。"]}),s.jsx("img",{src:"/support-selection/health-img.jpg",alt:"健康"}),s.jsx("div",{className:"ss-health-icon ss-pc",children:s.jsx("img",{src:"/support-selection/health.svg",alt:"健康イラスト",className:"ss-icon-anime"})})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["美容",s.jsx("span",{className:"ss-h3-after",children:"/ BEAUTY"})]}),s.jsx("p",{children:"エステや整体、脱毛からヘアサロンまで全国にある大手チェーンや有名店などのビューティーサービスの優待利用が受けられます。"}),s.jsx("img",{src:"/support-selection/beauty-img.jpg",alt:"美容"}),s.jsx("div",{className:"ss-beauty-icon ss-pc",children:s.jsx("img",{src:"/support-selection/beauty.svg",alt:"美容イラスト",className:"ss-icon-anime2"})})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["修理手配",s.jsx("span",{className:"ss-h3-after",children:"/ REPAIR"})]}),s.jsxs("p",{children:["一定の家電機器や住宅設備機器に特定故障が生じた場合、修理業者を手配します。",s.jsx("br",{}),"どこに連絡したら良いのかわからないといった不安を解消します。"]}),s.jsx("img",{src:"/support-selection/repair-img.jpg",alt:"修理手配"})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["ライフプランニング",s.jsx("span",{className:"ss-h3-after",children:"/ LIFE PLANNING"})]}),s.jsxs("p",{children:["保険・資産形成・将来設計。お客様のお金に関するすべてのご相談に対して最適化を図ります。",s.jsx("br",{}),"最短「翌日」のご相談も受け付けています。"]}),s.jsx("img",{src:"/support-selection/lifeplanning-img.jpg",alt:"ライフプランニング"}),s.jsx("div",{className:"ss-lifeplanning-icon ss-pc",children:s.jsx("img",{src:"/support-selection/lifeplanning.svg",alt:"ライフプランニングイラスト",className:"ss-icon-anime"})})]}),s.jsxs("li",{children:[s.jsxs("h3",{children:["生活トラブルサポート",s.jsx("span",{className:"ss-h3-after",children:"/ TROUBLE SUPPORT"})]}),s.jsxs("p",{children:["玄関や窓鍵のトラブルサポートを、専門のスタッフが24時間365日対応します。",s.jsx("br",{}),"緊急時のトラブルも安心してお任せください。"]}),s.jsx("img",{src:"/support-selection/troublesupport-img.jpg",alt:"生活トラブルサポート"}),s.jsx("div",{className:"ss-repair-icon ss-pc",children:s.jsx("img",{src:"/support-selection/repair.svg",alt:"生活トラブルサポートイラスト",className:"ss-icon-anime2"})})]})]})]}),s.jsx("div",{className:"ss-curve-bottom"})]}),s.jsxs("section",{className:"ss-sec-qa",children:[s.jsx("h2",{id:"qa",children:"よくあるご質問"}),s.jsxs("div",{className:"ss-qa-cont",children:[s.jsx("h3",{children:s.jsxs("label",{children:[s.jsx("input",{type:"checkbox",defaultChecked:!0}),"「株式会社あんしんサポート」からの引き落としについて",s.jsx("span",{className:"ss-plus",children:s.jsx("span",{})})]})}),s.jsx("div",{className:"ss-answer-wrap",children:s.jsxs("p",{className:"ss-answer-wrap-in",children:["ご利用明細に「株式会社あんしんサポート」「サポートセレクション」「サポセレ」と記載されたご請求について、内容にご不明点をお持ちの方へご案内です。",s.jsx("br",{}),s.jsx("br",{}),"このご請求は、「サポートセレクション」というサービスに関するものです。",s.jsx("br",{}),"「サポートセレクション」は、電気・ガス・インターネットなどのご契約にあわせて、生活に役立つサポートサービスを提供する有料オプションです。",s.jsx("br",{}),s.jsx("br",{}),"サービスのご契約は、お支払い方法としてクレジットカードやキャリア決済、口座振替をご利用いただいております。",s.jsx("br",{}),"「マイページにログインできない」「支払方法を変更したい」といった場合は、以下までお気軽にお問い合わせください。",s.jsx("br",{}),s.jsx("br",{}),s.jsx("span",{className:"material-symbols-outlined",children:"mail"}),"お問い合わせ：",s.jsx("a",{href:"mailto:support@support-selection.com",children:"support@support-selection.com"})]})})]}),s.jsxs("div",{className:"ss-qa-cont",children:[s.jsx("h3",{children:s.jsxs("label",{children:[s.jsx("input",{type:"checkbox",defaultChecked:!0}),"解約したい",s.jsx("span",{className:"ss-plus",children:s.jsx("span",{})})]})}),s.jsx("div",{className:"ss-answer-wrap",children:s.jsxs("p",{className:"ss-answer-wrap-in",children:["■マイページからの解約手続きについて",s.jsx("br",{}),"マイページにログインのうえ、お手続きいただけます。",s.jsx("br",{}),"ログインURL：",s.jsxs("a",{href:"https://customer.support-selection.com/login",target:"_blank",rel:"noopener noreferrer",children:["https://customer.support-selection.com/login",s.jsx("span",{className:"material-symbols-outlined",children:"open_in_new"})]}),s.jsx("br",{}),"ログインには、【SMSでご案内したログインID】と【ご自身で設定されたパスワード】が必要です。",s.jsx("br",{}),s.jsx("br",{}),"■お電話での解約について 以下の番号にて自動音声での受付を行っております。",s.jsx("br",{}),s.jsx("a",{href:"tel:050-5050-0597",children:"050-5050-0597"}),"（24時間受付・固定電話不可）",s.jsx("br",{}),s.jsx("br",{}),"■メールでの解約について",s.jsx("br",{}),"下記アドレス宛にご連絡ください。",s.jsx("br",{}),s.jsx("a",{href:"mailto:support@support-selection.com",children:"support@support-selection.com"}),s.jsx("br",{}),"※ログインIDがご不明の場合は、ご本人様確認のため、以下の情報を確認させていただく場合がございます。",s.jsx("br",{}),"・お客様名",s.jsx("br",{}),"・ご登録のお電話番号　など"]})})]}),s.jsxs("div",{className:"ss-qa-cont",children:[s.jsx("h3",{children:s.jsxs("label",{children:[s.jsx("input",{type:"checkbox",defaultChecked:!0}),"ログインができない",s.jsx("span",{className:"ss-plus",children:s.jsx("span",{})})]})}),s.jsx("div",{className:"ss-answer-wrap",children:s.jsxs("p",{className:"ss-answer-wrap-in",children:["パスワード再設定はこちらからお手続きいただけます。",s.jsx("br",{}),s.jsxs("a",{href:"https://customer.support-selection.com/forgot-password",target:"_blank",rel:"noopener noreferrer",children:["https://customer.support-selection.com/forgot-password",s.jsx("span",{className:"material-symbols-outlined",children:"open_in_new"})]})]})})]}),s.jsxs("div",{className:"ss-qa-cont",children:[s.jsx("h3",{children:s.jsxs("label",{children:[s.jsx("input",{type:"checkbox",defaultChecked:!0}),"請求日を知りたい",s.jsx("span",{className:"ss-plus",children:s.jsx("span",{})})]})}),s.jsx("div",{className:"ss-answer-wrap",children:s.jsxs("p",{className:"ss-answer-wrap-in",children:["■クレジットカード・携帯キャリア決済をご利用のお客様",s.jsx("br",{}),"・2025年6月までのご利用分",s.jsx("br",{}),"ご利用月の前月27日にご請求",s.jsx("br",{}),s.jsx("br",{}),"・2025年7月以降のご利用分",s.jsx("br",{}),"ご利用月の27日にご請求",s.jsx("br",{}),s.jsx("br",{}),"■口座振替をご利用のお客様",s.jsx("br",{}),"ご利用月の翌月27日に登録口座よりお引き落とし"]})})]}),s.jsxs("div",{className:"ss-qa-cont",children:[s.jsx("h3",{children:s.jsxs("label",{children:[s.jsx("input",{type:"checkbox",defaultChecked:!0}),"サポート窓口について",s.jsx("span",{className:"ss-plus",children:s.jsx("span",{})})]})}),s.jsx("div",{className:"ss-answer-wrap",children:s.jsxs("div",{className:"ss-answer-wrap-in ss-flex",children:[s.jsxs("div",{className:"ss-gray",children:[s.jsx("h4",{children:"メールサポート"}),s.jsx("div",{className:"ss-mail-link",children:s.jsx("a",{href:"mailto:support@support-selection.com",children:"support@support-selection.com"})}),s.jsx("p",{className:"ss-mail-recp-hours",children:"24時間受付"}),s.jsxs("ul",{className:"ss-mail-ul",children:[s.jsx("li",{children:"※通常は1営業日以内にご返信いたします。"}),s.jsx("li",{children:"※時間帯や混雑状況により、翌営業日になることがあります。"})]})]}),s.jsxs("div",{className:"ss-gray",children:[s.jsx("h4",{children:"お電話でのお問い合わせ"}),s.jsxs("div",{className:"ss-gray-inner-flex",children:[s.jsxs("div",{className:"ss-gray-inner-flex-item-a",children:[s.jsx("h5",{children:"【解約受付】"}),s.jsx("div",{className:"ss-tel-link",children:s.jsx("a",{href:"tel:050-5050-0597",children:"050-5050-0597"})}),s.jsxs("p",{className:"ss-tel-recp-hours",children:["24時間受付",s.jsx("br",{className:"ss-sp"}),"（自動音声）"]}),s.jsx("ul",{className:"ss-tel-ul",children:s.jsx("li",{children:"※固定電話不可"})})]}),s.jsxs("div",{className:"ss-gray-inner-flex-item-b",children:[s.jsx("h5",{children:"【その他のお問い合わせ】"}),s.jsx("div",{className:"ss-tel-link",children:s.jsx("a",{href:"tel:050-5050-0670",children:"050-5050-0670"})}),s.jsxs("p",{className:"ss-tel-recp-hours",children:["営業時間：",s.jsx("br",{className:"ss-sp"}),"11:00～21:00",s.jsx("br",{}),s.jsx("span",{className:"ss-nenmatsu",children:"（年末年始を除く）"})]})]})]})]})]})})]})]}),s.jsxs("section",{className:"ss-sec-company",children:[s.jsx("div",{className:"ss-bg-dot-4 ss-pc"}),s.jsxs("div",{className:"ss-company-overview-in",children:[s.jsx("h2",{children:"会社概要"}),s.jsxs("dl",{children:[s.jsx("dt",{children:"運営会社"}),s.jsx("dd",{children:"株式会社あんしんサポート"})]}),s.jsxs("dl",{children:[s.jsx("dt",{children:"代表取締役"}),s.jsx("dd",{children:"池本 大介"})]}),s.jsxs("dl",{children:[s.jsx("dt",{children:"本社所在地"}),s.jsx("dd",{children:"東京都豊島区南池袋2-32-4　南池袋公園ビル"})]}),s.jsxs("dl",{children:[s.jsx("dt",{children:"事業内容"}),s.jsxs("dd",{children:["アウトソーシング・BPO事業",s.jsxs("ul",{children:[s.jsx("li",{children:"営業、販売プロセスにおけるアウトソーシング"}),s.jsx("li",{children:"インターネット等を利用したデジタルコンテンツの配信や情報提供"}),s.jsx("li",{children:"webサイトの運営及びコンサルティング事業"}),s.jsx("li",{children:"前各号に付帯または関連する一切の業務"})]})]})]})]})]}),s.jsxs("footer",{className:"ss-footer",children:[s.jsx("a",{href:"#",children:"プライバシーポリシー"}),s.jsx("br",{}),s.jsx("span",{children:"株式会社あんしんサポート"}),s.jsx("div",{className:"ss-copy",children:"© 2025 サポートセレクション"})]})]})]})]}));export{t as default};
