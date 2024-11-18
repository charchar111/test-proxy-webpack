const path = require("path");
const Dotenv = require("dotenv-webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ModuleFederationSet = require("./moduleFederation");

module.exports = () => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const envPath = isDevelopment
    ? path.resolve(__dirname, ".env.development")
    : path.resolve(__dirname, ".env.production");

  return {
    entry: "./client/index.tsx", // 애플리케이션의 진입점. 번들링 시 가장 먼저 시작하는 파일

    // 번들링 결과물
    output: {
      filename: "bundle.js", // 파일 이름
      path: path.resolve(__dirname, "dist"), // 빌드된 파일이 저장되는 경로
      publicPath: "/", // 브라우저에서 빌드된 프론트엔드 파일에 접근하는 url경로
      clean: true, // 빌드 시, 이전 빌드 파일을 삭제함. 불필요한 파일이 누적되는 걸 방지
    },

    // 모듈의 경로나 파일 타입을 해석하는 방식을 결정
    // import나 require로 모듈 삽입 시, 경로를 정의하는 방식
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"], // 확장자가 생략된 경우 가져올 모듈의 파일 확장자 지정
      // extensions: [".js", ".jsx"],
      modules: ["client", "node_modules"], // 모듈을 찾을 때 참조할 디렉토리의 목록을 정의. 자동으로 절대경로로 client와 node_modules부터 사용가능함

      // 특정 경로에 대한 절대경로를 별칭으로 설정
      // ex: import publicImage1 from @public/image/publicImage1.png;
      alias: {
        "@client": path.resolve(__dirname, "client"),
        "@public": path.resolve(__dirname, "public"),
        "@asset": path.resolve(__dirname, "client", "asset"),
      },
    },
    // 개발용 로컬 서버
    devServer: {
      open: true,
      port: 4000, // 포트번호
      hot: true, // hmr 기능 활성화
      // host: "0.0.0.0",
      historyApiFallback: {
        disableDotRule: true,
      }, // spa앱의 history api에 의한 변경으로, url 접근이나 새로고침 시 404에러가 나지 않도록 함
      static: [
        {
          directory: path.join(__dirname, "public"),
          publicPath: "/public",
        },
      ],
      compress: true,
      devMiddleware: {
        index: false,
      },

      proxy: [
        {
          context: ["/getjson", "/getjson2", "/setAnotherCookie"],
          target: "http://localhost:5000",
          secure: false,
          changeOrigin: true,
          router: function (req) {},

          onProxyReq: (proxyReq, req, res) => {},
          onProxyRes: (proxyRes, req, res) => {
            /* handle proxyRes */
            // console.log("proxyRes", proxyRes);
            // console.log("proxyRes.cookie", proxyRes.header);
          },
          onError: (err, req, res) => {
            /* handle error */
          },
        },
        {
          context: ["/echo"],
          target: "http://echo.jsontest.com",
          secure: false,
          changeOrigin: true,
          router: function (req, res, proxyOption) {},
          onProxyReq: (proxyReq, req, res) => {
            /*  */
          },
          onProxyRes: (proxyRes, req, res) => {
            /* handle proxyRes */
          },
          onError: (err, req, res) => {
            /* handle error */
          },
        },
      ],
    },

    // eval-source-map: 번들 파일 내에 소스맵이 포함. 디버깅 시 원본 소스에 가까운 코드를 제공하나 무거우므로 성능이 느림 => 개발에 적합
    // source-map: 디버깅 시 번들 파일과 별도의 소스 맵을 제공함. eval-source-map보다 원본이 변형되었으나 성능이 빠름 => 배포에 적합
    devtool: isDevelopment ? "eval-source-map" : "source-map",
    // optimization: {
    //   splitChunks: {
    //     chunks: "all", // 모든 청크에서 공통 모듈 추출
    //   },
    // },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/, // .ts, .tsx, .js, .jsx 확장자에 대해
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader", // TypeScript 로더
              options: {
                transpileOnly: true, // 타입 검사만 하기. 컴파일 검사를 하지 않음
              },
            },
            {
              loader: "babel-loader", // JavaScript 변환을 위한 Babel 로더
            },
          ],
        },

        // 폰트 처리
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[hash:8][ext]", // 폰트 파일이 번들된 후 저장될 위치
          },
        },
        // {
        //   test: /\.(woff|woff2|ttf|eot|otf)$/,
        //   use: [
        //     {
        //       loader: "file-loader",
        //       options: {
        //         name: "assets/fonts/[name].[hash:8].[ext]", // 폰트 파일이 번들된 후 저장될 위치
        //       },
        //     },
        //   ],
        // },

        {
          test: /\.(css|s[ac]ss)$/i, // .scss 및 .sass 파일을 처리
          use: [
            "style-loader", // DOM에 스타일 추가
            "css-loader", // CSS를 모듈로 변환
            "sass-loader", // Sass 파일을 CSS로 변환
          ],
        },

        // 에셋 처리 방식: 웹팩 5
        {
          test: /\.svg$/, // .svg 확장자를 가진 파일에 대해 설정을 적용

          //  확장자 패턴에 대해 복수의 로더 중 하나만 적용하는 분기처리 옵션
          oneOf: [
            {
              use: ["@svgr/webpack"], // @svgr/webpack 로더를 사용하여 SVG를 React 컴포넌트로 변환 - svg 태그로 삽입
              issuer: /\.[jt]sx?$/, // JavaScript 또는 TypeScript 파일(.js, .jsx, .ts, .tsx) 안에서만 이 설정을 적용. svg의 동적 스타일링을 위함
              resourceQuery: { not: [/url/] }, // 모듈 경로에서 url이 포함되어 있을 시, 모듈 적용 x
            },
            {
              type: "asset",
              resourceQuery: /url/, // *.svg?url.
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif|ico)$/i, // 이미지 파일 확장자 처리
          type: "asset",
        },

        // 에셋 처리 방식: 웹팩 4
        // {
        //   test: /\.svg$/, // .svg 확장자를 가진 파일에 대해 설정을 적용

        //   //  확장자 패턴에 대해 복수의 로더 중 하나만 적용하는 분기처리 옵션
        //   oneOf: [
        //     {
        //       use: ["@svgr/webpack"], // @svgr/webpack 로더를 사용하여 SVG를 React 컴포넌트로 변환 - svg 태그로 삽입
        //       issuer: /\.[jt]sx?$/, // JavaScript 또는 TypeScript 파일(.js, .jsx, .ts, .tsx) 안에서만 이 설정을 적용. svg의 동적 스타일링을 위함
        //       resourceQuery: { not: [/url/] }, // 모듈 경로에서 url이 포함되어 있을 시, 모듈 적용 x
        //     },
        //     {
        //       // img.client 태그로 삽입하기 위해 svg 파일 모듈을 url로 변환
        //       loader: "file-loader",
        //       options: {
        //         name: "[path][name].[ext]", // 파일 경로와 이름을 그대로 유지
        //       },
        //       resourceQuery: /url/, // *.svg?url.
        //     },
        //   ],
        // },
        // // 만약 svg 확장자를 분기처리 없이 리엑트 컴포넌트로만 다룰 경우, 아래 설정 사용
        // // {
        // //   test: /\.svg$/i,
        // //   issuer: /\.[jt]sx?$/,
        // //   use: ["@svgr/webpack"],
        // // },
        // {
        //   test: /\.(png|jpe?g|gif|ico)$/i, // 이미지 파일 확장자 처리
        //   use: [
        //     {
        //       loader: "file-loader",
        //       options: {
        //         name: "[path][name].[ext]", // 파일 경로와 이름을 그대로 유지
        //       },
        //     },
        //   ],
        // },
      ],
    },
    plugins: [
      // ModuleFederationSet(),
      new Dotenv({ path: envPath }),
      new CopyWebpackPlugin({ patterns: [{ from: "public", to: "public" }] }),
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),
    ],
  };
};
