<template>
  <div class="mobile landing-bg" v-if="isMobile && !isIos">
    <div class="content" >
      <header  style="font-size: 17px;">PikPak</header>
      <div class="thumbnail" >
        <div
          class="thumbnail__blur"
          
          :style="{ backgroundImage: 'url(' + fileInfo?.meta?.thumbnail_link + ')' }"
        ></div>
        <div class="el-image" >
          <img
            class="el-image__inner"
            :src="fileInfo?.meta?.thumbnail_link"
            style="object-fit: contain;"
          />
          <!--v-if-->
        </div>
        <div class="info" >
          <div class="file-icon" >
            <div class="el-image" >
              <img
                class="el-image__inner"
                :src="fileInfo?.meta?.icon"
              />
              <!--v-if-->
            </div>
          </div>
          <div  style="min-width: 0px;">
            <div class="name">{{ fileInfo?.name }}</div>
            <div >
              <span class="file-count">{{ fileInfo?.file_count }}个文件</span>
              <span class="file-size">{{ byteConvert(fileInfo.file_size) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        style="margin-top: 16px; font-size: 15px; line-height: 22px; text-align: center;"
      >当前文件保存中,请打开 PikPak App 查看</div>
      <div class="google-play" >
        <div >
          <div class="installed" @click="toGooglePlay('GooglePlay', route.query)"></div>
          <div class="no-installed" @click="getApk()">
            <div class="tips1" >未安装 Google Play</div>
            <div class="tips2" >下载安装包</div>
          </div>
        </div>
        <a class="open-app" @click="callApp('downloaded', route.query)"  style="cursor: pointer;">已安装PikPak，前往查看 &gt;</a>
      </div>
      <div class="features" >
        <div class="item" @click="callApp('collect', route.query)">
          <div class="icon" >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              
            >
              <rect width="60" height="60" rx="30" fill="white" fill-opacity="0.8" />
              <mask
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="60"
                height="60"
                style="mask-type: alpha;"
              >
                <rect width="60" height="60" rx="30" fill="white" />
              </mask>
              <g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M29.0003 18.1874C24.3578 18.3503 20.6238 22.068 20.4601 26.6901L20.4586 26.7908L20.3352 26.8342C17.1875 27.9952 15 31.0095 15 34.4738C15 38.9727 18.6631 42.6198 23.1818 42.6198H36.8182C41.3369 42.6198 45 38.9727 45 34.4738L44.9944 34.1684C44.8518 30.3177 42.0246 27.1497 38.3214 26.465L38.1614 26.4391L38.1596 26.3764C37.835 21.7967 34.0006 18.1818 29.3182 18.1818L29.0003 18.1874Z"
                  fill="var(--color-primary)"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M26.6814 32.3637C25.9501 33.3176 26.1172 34.6852 27.0545 35.4184C27.9634 36.1294 29.2629 35.9828 30.0076 35.1035L30.0758 35.0189L32.724 31.5646L35.0576 33.3901L32.5749 36.6284C30.8381 38.8938 27.6254 39.3187 25.3993 37.5773C23.1732 35.836 22.7765 32.5878 24.5133 30.3224L26.9961 27.084L29.3297 28.9095L26.6814 32.3637Z"
                  fill="white"
                />
                <path
                  d="M28.0516 25.7074C28.2442 25.4561 28.6026 25.4106 28.852 25.6057L30.3059 26.743C30.5553 26.938 30.6013 27.2999 30.4086 27.5512L29.6342 28.5613L27.2771 26.7176L28.0516 25.7074Z"
                  fill="white"
                />
                <path
                  d="M33.7625 30.175C33.9552 29.9237 34.3135 29.8782 34.5629 30.0733L36.0168 31.2106C36.2662 31.4056 36.3122 31.7675 36.1195 32.0188L35.3451 33.0289L32.9881 31.1852L33.7625 30.175Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
          <div class="title" >全能云下载</div>
        </div>
        <div class="item" @click="callApp('6T', route.query)">
          <div class="icon" >
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              
            >
              <rect width="72" height="72" rx="36" fill="white" fill-opacity="0.8" />
              <mask
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="72"
                height="72"
                style="mask-type: alpha;"
              >
                <rect width="72" height="72" rx="36" fill="white" />
              </mask>
              <g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.7119 32.2197C19.8964 31.7539 21.1733 31.1442 22.2995 30.5031V47.4137C22.2995 48.0074 22.7809 48.4887 23.3746 48.4887H25.8906C26.4843 48.4887 26.9657 48.0074 26.9657 47.4137V25.864L26.9849 25.8314L26.9657 25.8251V25.0751C26.9657 24.4813 26.4843 24 25.8906 24H23.3746C22.9985 24 22.6676 24.1931 22.4754 24.4855L22.4576 24.5039C22.0698 24.9027 20.8687 26.1379 18.7463 26.9714C18.3088 27.1433 18.0005 27.5541 18.0004 28.0242L18 31.7255C18 32.0966 18.3666 32.3555 18.7119 32.2197ZM34.9721 48.4887C37.0621 48.4887 39.0104 47.4672 40.1086 44.8865C40.8525 43.1661 41.313 40.9619 41.313 36.2845C41.313 32.6284 41.1325 29.7315 40.1086 27.3963C39.0847 25.0611 37.1792 24.0469 34.9721 24.0013C32.6849 23.9541 30.6713 25.162 29.6607 27.3963C28.6966 29.5276 28.6994 32.9898 28.7017 35.8711L28.7019 36.2845C28.7019 40.3167 29.0207 42.6285 29.9418 44.8865C30.8982 47.1446 32.5986 48.4887 34.9721 48.4887ZM35.0222 43.4645C34.5156 43.4645 34.048 43.0706 33.7753 42.4143C33.2844 41.115 33.2983 38.328 33.306 36.7782L33.306 36.7774C33.3069 36.605 33.3077 36.448 33.3077 36.31C33.3077 36.1285 33.3068 35.9327 33.3059 35.726L33.3059 35.7254L33.3059 35.7229L33.3059 35.7226C33.2982 33.9475 33.2869 31.367 33.7753 30.0744C34.048 29.4181 34.5156 29.0242 35.0222 29.0242C35.5288 29.0242 36.0718 29.4218 36.2692 30.0744C36.7091 31.5297 36.7122 34.2618 36.7091 36.31C36.7088 36.5295 36.7105 36.7761 36.7123 37.0419C36.7239 38.7412 36.7409 41.2223 36.2692 42.4143C35.9964 43.0706 35.5288 43.4645 35.0222 43.4645ZM51.0736 47.4512C51.0736 48.0449 50.5923 48.5263 49.9985 48.5263H47.2635C46.6697 48.5263 46.1884 48.0449 46.1884 47.4512V29.5101C46.1884 28.9164 45.7071 28.4351 45.1133 28.4351H43.1351C42.5414 28.4351 42.0601 27.9537 42.0601 27.36V25.1066C42.0601 24.5128 42.5414 24.0315 43.1351 24.0315H54.1268C54.7206 24.0315 55.2019 24.5128 55.2019 25.1066V27.36C55.2019 27.9537 54.7206 28.4351 54.1268 28.4351H52.1487C51.5549 28.4351 51.0736 28.9164 51.0736 29.5101V47.4512Z"
                  fill="var(--color-primary)"
                />
              </g>
            </svg>
          </div>
          <div class="title" >畅享10TB云盘空间</div>
        </div>
        <div class="item" @click="callApp('short_video', route.query)">
          <div class="icon" >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              
            >
              <rect width="60" height="60" rx="30" fill="white" fill-opacity="0.8" />
              <mask
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="60"
                height="60"
                style="mask-type: alpha;"
              >
                <rect width="60" height="60" rx="30" fill="white" />
              </mask>
              <g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M46.6019 23.7397C46.6019 22.9219 45.7142 22.413 45.0085 22.826L37.0742 27.4695L37.0849 31.097C37.0861 31.4717 37.2852 31.8179 37.6085 32.0073L45.0082 36.3419C45.7139 36.7553 46.6019 36.2463 46.6019 35.4284V23.7397Z"
                  fill="var(--color-primary)"
                />
                <mask
                  id="mask2_2245_41293"
                  maskUnits="userSpaceOnUse"
                  x="37"
                  y="22"
                  width="10"
                  height="15"
                  style="mask-type: alpha;"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M46.6019 23.7397C46.6019 22.9219 45.7142 22.413 45.0085 22.826L37.0742 27.4695L37.0849 31.097C37.0861 31.4717 37.2852 31.8179 37.6085 32.0073L45.0082 36.3419C45.7139 36.7553 46.6019 36.2463 46.6019 35.4284V23.7397Z"
                    fill="white"
                  />
                </mask>
                <path
                  d="M16 23C16 20.7909 17.7909 19 20 19H35.1935C37.4027 19 39.1936 20.7909 39.1936 23V36.1725C39.1936 38.3817 37.4027 40.1725 35.1936 40.1725H20C17.7909 40.1725 16 38.3817 16 36.1725V23Z"
                  fill="#306EFF"
                />
                <path
                  d="M27.4087 31.3533H22.5638C22.2428 31.3533 22.0526 30.9941 22.2329 30.7285L26.4552 24.5122C26.5297 24.4025 26.6536 24.3369 26.7861 24.3369H30.4687C30.7818 24.3369 30.9735 24.6806 30.809 24.947L28.5671 28.5785H32.505C32.8447 28.5785 33.0298 28.9751 32.8116 29.2354L26.4363 36.8406C26.3001 37.0031 26.0378 36.8697 26.089 36.6639L27.4087 31.3533Z"
                  fill="white"
                />&gt;
              </g>
            </svg>
          </div>
          <div class="title" >
            <div >极速秒存</div>
            <div >一键播放</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" >
      <a href="https://inapp.mypikpak.com/policy/privacy-policy" >隐私政策</a>&nbsp;
      <a href="https://inapp.mypikpak.com/policy/user-agreement" >用户协议</a>&nbsp;PikPak © 2022
    </div>
  </div>
  <div class="landing-bg" v-else>
    <div class="landing">
      <header class="payment-header">
        <a href="./" class>
          <svg class="logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              opacity="0.985601"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M35.4485 20.2408C34.9695 20.1802 34.5625 19.8616 34.3885 19.4112L32.9484 15.6823C32.8292 15.3737 33.0824 15.0495 33.4107 15.0903L48.5667 16.9768C49.3455 17.0737 50.0128 17.5803 50.3154 18.3045L52 22.3354L35.4485 20.2408Z"
              fill="var(--color-primary)"
            />
            <path
              opacity="0.985601"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M28.5838 20.2408C29.0627 20.1802 29.4698 19.8616 29.6437 19.4112L31.0838 15.6823C31.203 15.3737 30.9498 15.0495 30.6215 15.0903L15.4655 16.9768C14.6867 17.0737 14.0194 17.5803 13.7168 18.3045L12.0322 22.3354L18.8878 21.4678L28.5838 20.2408Z"
              fill="var(--color-primary)"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 22.3354H52V44.3042C52 46.775 49.9971 48.7779 47.5263 48.7779H16.4737C14.0029 48.7779 12 46.775 12 44.3042V22.3354Z"
              fill="var(--color-primary)"
            />
            <path
              d="M27.5557 42.1111C27.5557 42.1111 29.7551 43 31.9794 43C34.2037 43 36.4446 42.1111 36.4446 42.1111"
              stroke="white"
              stroke-width="2.23683"
              stroke-linecap="round"
            />
            <path
              d="M24.8885 31.0001V34.5556"
              stroke="white"
              stroke-width="3.57893"
              stroke-linecap="round"
            />
            <path
              d="M39.1111 31.0001V34.5556"
              stroke="white"
              stroke-width="3.57893"
              stroke-linecap="round"
            />
            <path
              class="logo-text"
              d="M83.028 29.468C83.028 30.4387 82.794 31.3487 82.326 32.198C81.8753 33.0473 81.156 33.732 80.168 34.252C79.1973 34.772 77.9667 35.032 76.476 35.032H73.434V42H69.794V23.852H76.476C77.88 23.852 79.076 24.0947 80.064 24.58C81.052 25.0653 81.7887 25.7327 82.274 26.582C82.7767 27.4313 83.028 28.3933 83.028 29.468ZM76.32 32.094C77.3253 32.094 78.0707 31.8687 78.556 31.418C79.0413 30.95 79.284 30.3 79.284 29.468C79.284 27.7 78.296 26.816 76.32 26.816H73.434V32.094H76.32ZM87.4584 25.88C86.817 25.88 86.2797 25.6807 85.8464 25.282C85.4304 24.866 85.2224 24.3547 85.2224 23.748C85.2224 23.1413 85.4304 22.6387 85.8464 22.24C86.2797 21.824 86.817 21.616 87.4584 21.616C88.0997 21.616 88.6284 21.824 89.0444 22.24C89.4777 22.6387 89.6944 23.1413 89.6944 23.748C89.6944 24.3547 89.4777 24.866 89.0444 25.282C88.6284 25.6807 88.0997 25.88 87.4584 25.88ZM89.2524 27.596V42H85.6124V27.596H89.2524ZM101.377 42L96.4887 35.864V42H92.8487V22.76H96.4887V33.706L101.325 27.596H106.057L99.7127 34.824L106.109 42H101.377ZM121.266 29.468C121.266 30.4387 121.032 31.3487 120.564 32.198C120.114 33.0473 119.394 33.732 118.406 34.252C117.436 34.772 116.205 35.032 114.714 35.032H111.672V42H108.032V23.852H114.714C116.118 23.852 117.314 24.0947 118.302 24.58C119.29 25.0653 120.027 25.7327 120.512 26.582C121.015 27.4313 121.266 28.3933 121.266 29.468ZM114.558 32.094C115.564 32.094 116.309 31.8687 116.794 31.418C117.28 30.95 117.522 30.3 117.522 29.468C117.522 27.7 116.534 26.816 114.558 26.816H111.672V32.094H114.558ZM122.915 34.746C122.915 33.29 123.201 31.9987 123.773 30.872C124.362 29.7453 125.151 28.8787 126.139 28.272C127.144 27.6653 128.262 27.362 129.493 27.362C130.567 27.362 131.503 27.5787 132.301 28.012C133.115 28.4453 133.765 28.9913 134.251 29.65V27.596H137.917V42H134.251V39.894C133.783 40.57 133.133 41.1333 132.301 41.584C131.486 42.0173 130.541 42.234 129.467 42.234C128.253 42.234 127.144 41.922 126.139 41.298C125.151 40.674 124.362 39.7987 123.773 38.672C123.201 37.528 122.915 36.2193 122.915 34.746ZM134.251 34.798C134.251 33.914 134.077 33.16 133.731 32.536C133.384 31.8947 132.916 31.4093 132.327 31.08C131.737 30.7333 131.105 30.56 130.429 30.56C129.753 30.56 129.129 30.7247 128.557 31.054C127.985 31.3833 127.517 31.8687 127.153 32.51C126.806 33.134 126.633 33.8793 126.633 34.746C126.633 35.6127 126.806 36.3753 127.153 37.034C127.517 37.6753 127.985 38.1693 128.557 38.516C129.146 38.8627 129.77 39.036 130.429 39.036C131.105 39.036 131.737 38.8713 132.327 38.542C132.916 38.1953 133.384 37.71 133.731 37.086C134.077 36.4447 134.251 35.682 134.251 34.798ZM150 42L145.112 35.864V42H141.472V22.76H145.112V33.706L149.948 27.596H154.68L148.336 34.824L154.732 42H150Z"
              fill="black"
            />
          </svg>
        </a>
        <div class="i18n-menu">
          <a class="pp-link-button" aria-describedby="el-popper-4250">简体中文</a>
        </div>
        <div class="user-info">
          <div class="avatar-wrapper avatar-button">
            <a class="avatar-box" aria-describedby="el-popper-2725">
              <div class="is-premium normal circle avatar-wrapper">
                <div class="placeholder"></div>
              </div>
            </a>
            <div class="avatar-content">
              <div class="username">{{ userInfo?.name }}</div>
              <!---->
            </div>
          </div>
        </div>
      </header>
      <div class="content">
        <div class="drive-features">
          <div class="desc">私密云盘，支持无限云添加</div>
          <div class="desc-block">
            <div class="desc-item">
              <div class="desc-icon">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="72" height="72" rx="36" fill="white" fill-opacity="0.8" />
                  <mask
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="72"
                    height="72"
                    style="mask-type: alpha;"
                  >
                    <rect width="72" height="72" rx="36" fill="white" />
                  </mask>
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.7119 32.2197C19.8964 31.7539 21.1733 31.1442 22.2995 30.5031V47.4137C22.2995 48.0074 22.7809 48.4887 23.3746 48.4887H25.8906C26.4843 48.4887 26.9657 48.0074 26.9657 47.4137V25.864L26.9849 25.8314L26.9657 25.8251V25.0751C26.9657 24.4813 26.4843 24 25.8906 24H23.3746C22.9985 24 22.6676 24.1931 22.4754 24.4855L22.4576 24.5039C22.0698 24.9027 20.8687 26.1379 18.7463 26.9714C18.3088 27.1433 18.0005 27.5541 18.0004 28.0242L18 31.7255C18 32.0966 18.3666 32.3555 18.7119 32.2197ZM34.9721 48.4887C37.0621 48.4887 39.0104 47.4672 40.1086 44.8865C40.8525 43.1661 41.313 40.9619 41.313 36.2845C41.313 32.6284 41.1325 29.7315 40.1086 27.3963C39.0847 25.0611 37.1792 24.0469 34.9721 24.0013C32.6849 23.9541 30.6713 25.162 29.6607 27.3963C28.6966 29.5276 28.6994 32.9898 28.7017 35.8711L28.7019 36.2845C28.7019 40.3167 29.0207 42.6285 29.9418 44.8865C30.8982 47.1446 32.5986 48.4887 34.9721 48.4887ZM35.0222 43.4645C34.5156 43.4645 34.048 43.0706 33.7753 42.4143C33.2844 41.115 33.2983 38.328 33.306 36.7782L33.306 36.7774C33.3069 36.605 33.3077 36.448 33.3077 36.31C33.3077 36.1285 33.3068 35.9327 33.3059 35.726L33.3059 35.7254L33.3059 35.7229L33.3059 35.7226C33.2982 33.9475 33.2869 31.367 33.7753 30.0744C34.048 29.4181 34.5156 29.0242 35.0222 29.0242C35.5288 29.0242 36.0718 29.4218 36.2692 30.0744C36.7091 31.5297 36.7122 34.2618 36.7091 36.31C36.7088 36.5295 36.7105 36.7761 36.7123 37.0419C36.7239 38.7412 36.7409 41.2223 36.2692 42.4143C35.9964 43.0706 35.5288 43.4645 35.0222 43.4645ZM51.0736 47.4512C51.0736 48.0449 50.5923 48.5263 49.9985 48.5263H47.2635C46.6697 48.5263 46.1884 48.0449 46.1884 47.4512V29.5101C46.1884 28.9164 45.7071 28.4351 45.1133 28.4351H43.1351C42.5414 28.4351 42.0601 27.9537 42.0601 27.36V25.1066C42.0601 24.5128 42.5414 24.0315 43.1351 24.0315H54.1268C54.7206 24.0315 55.2019 24.5128 55.2019 25.1066V27.36C55.2019 27.9537 54.7206 28.4351 54.1268 28.4351H52.1487C51.5549 28.4351 51.0736 28.9164 51.0736 29.5101V47.4512Z"
                      fill="var(--color-primary)"
                    />
                  </g>
                </svg>
              </div>
              <div class="desc-text">畅享10TB云盘空间</div>
            </div>
            <div class="desc-item">
              <div class="desc-icon">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="72" height="72" rx="36" fill="white" fill-opacity="0.8" />
                  <mask
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="72"
                    height="72"
                    style="mask-type: alpha;"
                  >
                    <rect width="72" height="72" rx="36" fill="white" />
                  </mask>
                  <g>
                    <rect
                      opacity="0.01"
                      x="19.1992"
                      y="19.2002"
                      width="33.6"
                      height="33.6"
                      fill="black"
                    />
                    <rect
                      opacity="0.01"
                      x="15.5996"
                      y="15.6001"
                      width="40.8"
                      height="40.8"
                      fill="black"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M34.795 21.4354C29.2028 21.6297 24.7049 26.063 24.5078 31.5751L24.506 31.6951L24.3573 31.7469C20.5657 33.1314 17.9307 36.726 17.9307 40.8573C17.9307 46.2223 22.3432 50.5716 27.7862 50.5716H44.2122C49.6553 50.5716 54.0678 46.2223 54.0678 40.8573L54.061 40.4931C53.8893 35.901 50.4838 32.1231 46.0229 31.3066L45.8302 31.2758L45.828 31.201C45.437 25.7396 40.8182 21.4287 35.1779 21.4287L34.795 21.4354Z"
                      fill="var(--color-primary)"
                    />
                    <path
                      d="M30.7549 36.5829L33.0863 34.2515V42.4115"
                      stroke="white"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M40.0801 40.0802L37.7486 42.4116V34.2516"
                      stroke="white"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <div class="desc-text">无限云传输次数</div>
            </div>
            <div class="desc-item">
              <div class="desc-icon">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="72" height="72" rx="36" fill="white" fill-opacity="0.8" />
                  <mask
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="72"
                    height="72"
                    style="mask-type: alpha;"
                  >
                    <rect width="72" height="72" rx="36" fill="white" />
                  </mask>
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M24.2794 49.2C24.8839 49.2 25.374 48.71 25.374 48.1055V39.7474C25.374 39.1429 25.864 38.6528 26.4685 38.6528H28.4124C29.0169 38.6528 29.507 39.1429 29.507 39.7474V48.1055C29.507 48.71 29.997 49.2 30.6015 49.2H33.386C33.9905 49.2 34.4806 48.71 34.4806 48.1055V25.0945C34.4806 24.49 33.9905 24 33.386 24H30.6015C29.997 24 29.507 24.49 29.507 25.0945V33.0279C29.507 33.6324 29.0169 34.1225 28.4124 34.1225H26.4685C25.864 34.1225 25.374 33.6324 25.374 33.0279V25.0945C25.374 24.49 24.8839 24 24.2794 24H21.4949C20.8904 24 20.4004 24.49 20.4004 25.0945V48.1055C20.4004 48.71 20.8904 49.2 21.4949 49.2H24.2794ZM44.2785 49.2C47.0805 49.2 48.6216 48.0674 49.7424 46.7579C51.4061 44.8113 51.5861 41.3407 51.5999 38.3331L51.6 37.2738L51.5991 36.9332L51.5988 36.6C51.5988 36.4006 51.5993 36.1966 51.5998 35.9888L51.6 35.9262L51.5999 34.8669C51.5861 31.8593 51.4061 28.3888 49.7424 26.4422C48.6216 25.1326 47.0805 24 44.2785 24H38.3329C37.7284 24 37.2384 24.4901 37.2384 25.0946V48.1055C37.2384 48.71 37.7284 49.2 38.3329 49.2H44.2785ZM43.3067 44.6697H44.1735C45.0842 44.6697 45.7146 44.2096 46.0299 43.5725C46.5261 42.5992 46.6088 40.3232 46.6225 37.9735L46.625 37.2676V35.8631C46.6212 33.2856 46.5757 30.6982 46.0299 29.6275C45.7146 28.9905 45.0842 28.5303 44.1735 28.5303H43.3067C42.7022 28.5303 42.2121 29.0204 42.2121 29.6249V43.5751C42.2121 44.1796 42.7022 44.6697 43.3067 44.6697Z"
                      fill="var(--color-primary)"
                    />
                  </g>
                </svg>
              </div>
              <div class="desc-text">高清无损画质</div>
            </div>
            <div class="desc-item">
              <div class="desc-icon">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="72" height="72" rx="36" fill="white" fill-opacity="0.8" />
                  <mask
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="72"
                    height="72"
                    style="mask-type: alpha;"
                  >
                    <rect width="72" height="72" rx="36" fill="white" />
                  </mask>
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M25.4758 48.2387C25.3624 48.7981 24.8706 49.2002 24.2998 49.2002H21.9379C21.1565 49.2002 20.5835 48.4653 20.7742 47.7075L26.2072 26.1075C26.3414 25.5741 26.821 25.2002 27.371 25.2002H30.1182C30.6682 25.2002 31.1478 25.5741 31.2819 26.1075L36.715 47.7075C36.9056 48.4653 36.3326 49.2002 35.5512 49.2002H33.1894C32.6185 49.2002 32.1267 48.7981 32.0133 48.2387L31.6445 46.4201C31.5311 45.8607 31.0393 45.4586 30.4685 45.4586H27.0207C26.4499 45.4586 25.958 45.8607 25.8446 46.4201L25.4758 48.2387ZM29.09 41.144C29.8491 41.144 30.4175 40.4481 30.2658 39.7043L29.9208 38.0122C29.6598 36.7319 27.8303 36.7319 27.5692 38.0122L27.2243 39.7043C27.0726 40.4481 27.641 41.144 28.4001 41.144H29.09ZM44.7023 49.2002C47.3413 49.2002 48.7927 48.1215 49.8483 46.8744C51.4693 44.9565 51.5948 41.4855 51.5986 38.5561L51.5979 37.8645L51.5971 37.5286L51.5967 37.2002C51.5967 37.01 51.5972 36.8156 51.5977 36.6175L51.5979 36.5358L51.5986 35.8443C51.5948 32.9149 51.4693 29.4439 49.8483 27.526C48.7927 26.2788 47.3413 25.2002 44.7023 25.2002H39.2717C38.609 25.2002 38.0717 25.7375 38.0717 26.4002V48.0002C38.0717 48.6629 38.609 49.2002 39.2717 49.2002H44.7023ZM43.9554 44.8856H44.6027C45.4604 44.8856 46.0542 44.4474 46.3511 43.8406C46.9119 42.7283 46.9119 39.8294 46.9119 37.1665C46.9119 34.5036 46.9119 31.6721 46.3511 30.5597C46.0542 29.953 45.4604 29.5148 44.6027 29.5148H43.9554C43.2927 29.5148 42.7554 30.0521 42.7554 30.7148V43.6856C42.7554 44.3483 43.2927 44.8856 43.9554 44.8856Z"
                      fill="var(--color-primary)"
                    />
                    <rect
                      x="20.6523"
                      y="51.8008"
                      width="43.2"
                      height="3.6"
                      rx="1.8"
                      transform="rotate(-45 20.6523 51.8008)"
                      fill="white"
                    />
                  </g>
                </svg>
              </div>
              <div class="desc-text">移除广告</div>
            </div>
          </div>
        </div>
        <div class="main">
          <div class="thumbnail">
            <div
              class="thumbnail__blur"
              :style="{ backgroundImage: 'url(' + fileInfo?.meta?.thumbnail_link + ')' }"
            ></div>
            <div class="el-image">
              <img
                class="el-image__inner"
                :src="fileInfo?.meta?.thumbnail_link"
                style="object-fit: contain;"
              />
              <!--v-if-->
            </div>
            <div class="info">
              <div class="file-icon">
                <div class="el-image">
                  <img class="el-image__inner" :src="fileInfo?.meta?.icon" />
                  <!--v-if-->
                </div>
              </div>
              <div style="min-width: 0px;">
                <div class="name">{{ fileInfo?.name }}</div>
                <div>
                  <span class="file-count">{{ fileInfo?.file_count }}个文件</span>
                  <span class="file-size">{{ byteConvert(fileInfo.file_size) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="operation">
            <div class="title lh24px">你的 PikPak 私人云盘已经准备就绪！</div>
            <div class="sub-title lh24px">一键立即保存，即可随时播放！</div>
            <div class="btn btn__create-task" @click="saveUrl">立即保存</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ClipboardJS from 'clipboard';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { byteConvert } from '../utils'
import http from '../utils/axios'
const route = useRoute()
const addUrl = computed(() => route.query.__add_url);
const userInfo = computed(() => JSON.parse(localStorage.getItem('pikpakUser') || '{}'))
const isMobile = computed(() => /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
const isIos = computed(() => /iPhone|iPod|iPad/i.test(navigator.userAgent))
const fileInfo = ref<any>({})
const composeDeepLink = (params: any) => {
  if (params.deepLink) {
    // telegram过来的链接
    let deepLink = params.deepLink;
    if (params.from) {
      deepLink = deepLink + '&from=' + params.from;
    }
    return deepLink;
  } else {
    // 合作方的提供的链接
    let from = params.__source ? `${params.__source}/page` : `other/page`;
    if (params.__campaign) {
      from = from + '/' + params.__campaign;
    }
    const deepLink = `/xpan/main_tab?tab=1&add_url=${encodeURIComponent(
      params.__add_url,
    )}&from=${encodeURIComponent(from)}`;
    return deepLink;
  }
}
const callApp = (button: any, params: any) =>{
  // 数据上报
  const deepLinkHost = 'pikpakapp://mypikpak.com';
  let deepLink = composeDeepLink(params);
  const hostDeepLink = deepLinkHost + deepLink;

  window.location.href = hostDeepLink;
}

const toGooglePlay = (button: any, params: any) => {
  let deepLink = btoa(composeDeepLink(params))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  window.location.href = `http://play.google.com/store/apps/details?id=com.pikcloud.pikpak&referrer=${deepLink}`;
}
const getFileInfo = () => {
  http.post('https://api-drive.mypikpak.com/drive/v1/resource/list', {
    page_size: 500,
    thumbnail_type: 'FROM_HASH',
    urls: addUrl.value,
  })
    .then((res: any) => {
      console.log(res)
      fileInfo.value = res.data?.list?.resources[0] || {}
    })
}

const copy = (value:string) => {
  nextTick(() => {
    const fakeElement = document.createElement('button')
    const clipboard = new ClipboardJS(fakeElement, {
      text: () => value,
      action: () => 'copy',
    })
    clipboard.on('success', (e) => {
      window.$message.success('复制成功')
      clipboard.destroy()
    })
    clipboard.on('error', (e) => {
      console.log(e.text)
      clipboard.destroy()
    })
    fakeElement.click()
  })
}
function matchResourceChannel () {
  const params = route.query as Record<string, string>;
  try {
    const channel = params.__source || params.from;
    const partnerAPK = [
      'google',
      'yy',
      'dmhy',
      'facebook',
      'spread',
      'cao',
      'webcloud',
      'official',
      'fz',
      'runbkk',
      'sqstore',
      '4kysw',
      'mrfl',
      'jcy',
      'acgnx',
      '24pd',
      'fanhao',
      'hihbt',
      'xcbot',
      'jhs',
      'fz2',
      ...Array.from(Array(100), (_, idx) => 'zy' + `${idx + 1}`.padStart(4, '0')),
    ];
    const partnerAPKMapping = partnerAPK.reduce((prev, curr) => ({
      ...prev,
      [curr]: `https://download.mypikpak.com/app/${curr}_PikPak.apk`,
    }), {});
    for (let k in partnerAPKMapping) {
      const reg = RegExp(`^${k}`, 'i');
      if (reg.test(channel)) {
        // @ts-ignore
        return partnerAPKMapping[k];
      }
    }
  } catch (err) {
    console.error('[matchResourceChannel:]', err);
  }
  return 'https://download.mypikpak.com/app/default_PikPak.apk';
}
const getApk = () => {
  addUrl.value && copy(addUrl.value + '');
  const downloadBtn = document.createElement('a');
  downloadBtn.href = matchResourceChannel();
  downloadBtn.download = 'PikPak.apk';
  document.body.appendChild(downloadBtn);
  downloadBtn.click();
  let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
    document.body.removeChild(downloadBtn);
    clearTimeout(timer);
    // @ts-ignore
    timer = 0;
  }, 3000);
}
const saveUrl = () => {
  let postData = {
    kind: "drive#file",
    upload_type: "UPLOAD_TYPE_URL",
    url: {
      url: addUrl.value,
    },
    folder_type: "DOWNLOAD"
  }
  http.post('https://api-drive.mypikpak.com/drive/v1/files', postData)
    .then((res:any) => {
      window.$message.success('添加成功, 请前往网盘查看')
    })
}
onMounted(() => {
  getFileInfo()
})
</script>

<style lang="scss" >
.landing-bg {
  --color-primary: #306eff;
  --color-primary-hover: #4a80ff;
  --color-primary-active: #175cff;
  --color-primary-disabled: rgba(48, 110, 255, 0.5);
  --color-hover: #f2f3f4;
  --color-premium: #d1ae6a;
  --el-color-primary: #306eff;
  --el-color-success: #54cfad;
  --el-color-danger: #ed4949;
  --el-color-error: #ed4949;
  --transition-delay: 0.3s;
  --transition-animation: cubic-bezier(0.645, 0.045, 0.355, 1);
  --no-repeat-center: no-repeat center;
  --color-primary-text: #000;
  --color-secondary-text: #666;
  --mobile-break-width: 768px;
  --mobile-max-width: calc(100vw - 20px);
  --el-text-color-regular: #666;
}
.landing-bg {
  width: 100%;
  min-height: var(--vh, 100vh);
  background: url(https://drive.mypikpak.com/assets/background.e7506910.svg)
      var(--no-repeat-center),
    rgba(209, 232, 255, 0.6);
  background-size: cover;
  .el-image__inner {
    width: 100%;
    height: 100%;
  }
  .el-image {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .el-image__inner {
    vertical-align: top;
  }
  .logo-svg {
    width: 155px;
    height: 64px;
  }
  @media screen and (max-width: 768px) {
    .logo-text {
      display: none;
    }
    .logo-svg {
      width: 55px;
    }
  }
  .avatar-wrapper {
    overflow: hidden;
  }
  .circle {
    border-radius: 50%;
  }
  .placeholder {
    width: 100%;
    height: 100%;
  }
  .is-premium {
    border: 2px solid #f4ead2;
  }
  .is-premium .placeholder {
    background: url(data:image/webp;base64,UklGRmYCAABXRUJQVlA4WAoAAAAQAAAAaQAAVwAAQUxQSEoBAAABgFZre9vmhWAGEQNBUBi4CNQSyCCwCIhBxcAQvnNCQAycAWAC6G41P1v919OIYOC2kaL0VnA07eEf8FtJKL2ypH6QXbfSSo41Wf/iy/7wHJjoaSRVROsnS0n/oEIzqSoDJXP9S6b28HQOXOVWYU+Wi/VZlbo7U7eaZVZpVtS/MEkGRrlcnkmLBJP+hU0OgYjP6V6ytby9/Z35dBYx7AsjEbfNmdGricHZW0RkOLsmRHP2Chhi+rIKcYzsERVxdkNclDaO5NysmPfuySS/ABNDjgvyfZYnc3allSj+7PO8KrosWSt4fzQd9WU79znJjG5Fg6EkvSrnjBNH+7OzZpaVbMAqs3iVGUBn1/nJRqpGqpnp6EwQ91MlukN8VKN///nbDGriXgt3YFcLO2BZC49Ac6qDIwA8VNMD2NbAFqhkeQ8b8HQa9+g4BQBWUDgg9gAAAJAJAJ0BKmoAWAA+kUSgSqWjo6Gm/Gh4sBIJZwBWVwZpxUY5zGJc/XJIUYtglCkU7jFLqQ5JUhKc8iz4yAvlnEM+XeFQGm2bH8MREMyWWSx2EHktCfAA/vj0Tt/xtAAI6XRNAm0rdmpsrTYLAdCWkldUgqqiXL+w+UVw+MO0bHYIh7JmxWPiUiEMEzW78Q8KJyRGCwvRhliKtDprVqcFqIoLBbzFDOg2vYofZaZet1I8TJNTpwy628+X+WWnxQ+hN0frY2r3q86V5vNIswUJwmIiWN9Lvu2iKesiCOAJH5nVdgRQEVvPfMNXVboTUkAxN5WOAAAAAA==)
      #d3be8f var(--no-repeat-center);
  }
  .normal {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
  }
  .normal .placeholder {
    background-size: 25px;
  }
  .avatar-wrapper {
    display: flex;
    align-items: center;
  }
  .avatar-box {
    display: flex;
    min-width: 50px;
    align-items: center;
    text-decoration: none;
    color: #000;
  }
  * {
    box-sizing: border-box;
  }
  span,
  a {
    padding: 0;
    margin: 0;
    font-weight: 400;
  }
  a,
  a:hover,
  a:visited,
  a:active {
    color: var(--color-primary);
    cursor: pointer;
    text-decoration: underline;
  }
  a:active {
    -webkit-tap-highlight-color: transparent;
  }
  .lh24px {
    line-height: 24px;
  }
  .pp-link-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    min-width: 36px;
    text-decoration: none !important;
    color: inherit !important;
    cursor: pointer;
    transition: all var(--transition-delay) var(--transition-animation);
  }
  .pp-link-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  div,
  span,
  a,
  img,
  header {
    margin: 0;
    padding: 0;
  }
  header {
    display: block;
  }
  .landing {
    margin: auto;
  }
  .content {
    display: flex;
  }
  .main {
    display: flex;
    width: 888px;
    flex: 0 0 888px;
    height: 460px;
    padding: 62px 36px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 16px;
  }
  .thumbnail {
    flex: 0 0 480px;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }
  .thumbnail > .el-image {
    height: 100%;
    width: 100%;
  }
  .thumbnail__blur {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(15px);
  }
  .thumbnail .info {
    display: flex;
    padding: 18px 42px;
    color: #fff;
    align-items: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 6%, #000 115%);
    transform: translateY(-100%);
  }
  .thumbnail .file-icon {
    width: 26px;
    height: 26px;
    flex: 0 0 26px;
  }
  .thumbnail .file-icon + div {
    margin-left: 18px;
  }
  .thumbnail .file-size {
    font-size: 12px;
    line-height: 16px;
    color: #fff9;
  }
  .thumbnail .file-count {
    font-size: 12px;
    line-height: 16px;
    margin-right: 4px;
    color: #fff9;
  }
  .thumbnail .name {
    line-height: 20px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .thumbnail .name + div {
    margin-top: 4px;
  }
  .operation {
    margin-left: 42px;
    padding-top: 82px;
  }
  .operation .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
  }
  .operation .sub-title {
    margin-top: 4px;
    color: var(--color-secondary-text);
    font-size: 13px;
  }
  .operation .btn {
    min-width: 200px;
    padding: 0 24px;
    display: inline-block;
    line-height: 48px;
    height: 48px;
    text-align: center;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
  }
  .operation .btn__create-task {
    cursor: pointer;
    margin-top: 32px;
    color: #fff;
    background: var(--color-primary);
  }
  @media screen and (min-width: 1200px) {
    .landing {
      width: 1200px;
    }
    .main {
      margin-left: 24px;
    }
  }
  @media screen and (max-width: 768px) {
    .main {
      padding: 0;
      background: unset;
    }
    .thumbnail {
      margin: 0 auto;
      width: 100%;
      flex: 0 0 calc((100vw - 20px) * 0.75);
    }
    .thumbnail .file-icon {
      width: 24px;
      flex: 0 0 24px;
    }
    .thumbnail .file-icon .el-image {
      height: 100%;
    }
    .thumbnail .file-icon + div {
      margin-left: 12px;
    }
    .thumbnail .el-image {
      height: calc((100vw - 20px) * 0.75);
    }
    .thumbnail .info {
      padding: 14px 16px;
    }
    .thumbnail .name {
      font-size: 15px;
      line-height: 20px;
    }
    .thumbnail .name + div {
      margin-top: 4px;
    }
    .thumbnail .file-count {
      font-size: 13px;
      line-height: 18px;
      margin-right: 4px;
    }
    .thumbnail .file-size {
      font-size: 13px;
      line-height: 18px;
    }
    .operation {
      text-align: center;
    }
    .operation .btn__create-task {
      margin-top: 24px;
    }
  }
  /*! CSS Used from: https://drive.mypikpak.com/assets/DriveFeatures.f4514ac7.css */
  .payment-header {
    display: flex;
    height: 64px;
    align-items: center;
  }
  .i18n-menu {
    margin-left: auto;
    margin-right: 16px;
  }
  .user-info {
    margin-right: 12px;
  }
  .avatar-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  .avatar-content .username {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
  }
  @media screen and (max-width: 460px) {
    .avatar-content {
      display: none;
    }
  }
  .drive-features {
    width: 288px;
    background: rgba(255, 255, 255, 0.36);
    border-radius: 16px;
    padding: 22px 24px;
  }
  .desc {
    font-weight: 600;
    font-size: 24px;
    line-height: 42px;
  }
  .desc-block {
    display: flex;
    flex-wrap: wrap;
  }
  .desc-item {
    flex: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
  }
  .desc-text {
    margin-top: 16px;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    word-break: break-all;
  }
  .desc-item .desc-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }
}
.mobile.landing-bg {
  padding-top: 24px;
  min-width: unset !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.mobile .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--mobile-max-width);
  margin: 0 auto;
}
.mobile .thumbnail {
  margin: 24px auto 0;
  width: 100%;
  flex: 0 0 calc((100vw - 20px) * 0.75);
}
.mobile .thumbnail .file-icon {
  width: 24px;
  flex: 0 0 24px;
}
.mobile .thumbnail .file-icon .el-image {
  height: 100%;
}
.mobile .thumbnail .file-icon + div {
  margin-left: 12px;
}
.mobile .thumbnail .el-image {
  height: calc((100vw - 20px) * 0.75);
}
.mobile .thumbnail .info {
  padding: 14px 16px;
}
.mobile .thumbnail .name {
  font-size: 15px;
  line-height: 20px;
}
.mobile .thumbnail .name + div {
  margin-top: 4px;
}
.mobile .thumbnail .file-count {
  font-size: 13px;
  line-height: 18px;
  margin-right: 4px;
}
.mobile .thumbnail .file-size {
  font-size: 13px;
  line-height: 18px;
}
.mobile .google-play {
  display: flex;
  margin-top: 32px;
  flex-direction: column;
  align-items: center;
}
.mobile .google-play > div {
  display: flex;
}
.mobile .google-play .installed {
  cursor: pointer;
  width: calc((100vw - 25px) / 2);
  height: 48px;
  border-radius: 5px;
  overflow: hidden;
  background: url(https://drive.mypikpak.com/assets/google-play-badge.e0b8e0e2.svg)
      var(--no-repeat-center),
    #000;
  background-position: 5px center;
}
.mobile .google-play .no-installed {
  cursor: pointer;
  width: calc((100vw - 25px) / 2);
  height: 48px;
  border-radius: 5px;
  overflow: hidden;
  margin-left: 8px;
  background: url(https://drive.mypikpak.com/assets/android.5da9a0ac.svg)
      var(--no-repeat-center),
    #fff;
  background-position: 15px center;
  padding-left: 50px;
}
.mobile .google-play .no-installed .tips1 {
  margin-top: 8px;
  line-height: 13px;
  font-size: 9px;
}
.mobile .google-play .no-installed .tips2 {
  font-size: 14px;
  line-height: 20px;
}
.mobile .google-play .open-app {
  margin-top: 16px;
  font-size: 11px;
  line-height: 16px;
  text-decoration: none;
}
.mobile .features {
  margin-top: 36px;
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  overflow-x: hidden;
}
.mobile .features .item {
  width: calc((100vw - 52px) / 3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.mobile .features .icon {
  cursor: pointer;
  width: 60px;
  height: 60px;
}
.mobile .features .icon svg {
  width: 100%;
  height: 100%;
}
.mobile .features .title {
  margin-top: 12px;
  font-size: 11px;
}
.mobile .footer {
  margin: 16px auto;
  font-size: 11px;
  color: #979797;
}
.mobile .footer a {
  color: #979797;
}
@media screen and (min-width: 880px) and (max-width: 1200px) {
  .landing-bg {
    min-width: 888px;
  }
  .landing {
    width: 888px;
  }
  .drive-features {
    display: none;
  }
  .main {
    margin-left: 0;
  }
}
@media screen and (max-width: 888px) {
  .landing-bg {
    min-width: 100vw;
  }
  .landing {
    width: 100vw;
  }
  .main {
    flex-direction: column;
    width: var(--mobile-max-width);
    flex: 0 0 var(--mobile-max-width);
    height: auto;
    margin: auto;
    padding: 24px;
  }
  .operation {
    padding-top: 24px;
    margin-left: 0;
  }
  .drive-features {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .thumbnail {
    margin: 0 auto;
    width: 100%;
    flex: 0 0 calc((100vw - 20px) * 0.75);
  }
  .thumbnail .file-icon {
    width: 24px;
    flex: 0 0 24px;
  }
  .thumbnail .file-icon .el-image {
    height: 100%;
  }
  .thumbnail .file-icon + div {
    margin-left: 12px;
  }
  .thumbnail .el-image {
    height: calc((100vw - 20px) * 0.75);
  }
  .thumbnail .info {
    padding: 14px 16px;
  }
  .thumbnail .name {
    font-size: 15px;
    line-height: 20px;
  }
  .thumbnail .name + div {
    margin-top: 4px;
  }
  .thumbnail .file-count {
    font-size: 13px;
    line-height: 18px;
    margin-right: 4px;
  }
  .thumbnail .file-size {
    font-size: 13px;
    line-height: 18px;
  }
}
</style>