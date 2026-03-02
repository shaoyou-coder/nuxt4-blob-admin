<template>
  <div class="dl-upload">
    <template v-if="canUpload">
      <el-upload
        ref="upload"
        list-type="picture"
        action=" "
        :file-list="outFileList"
        :before-upload="beforeUploadImg"
        :http-request="uploadSmallImg"
        :on-change="handleChange"
        drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <p>1.图片尺寸：{{imgConfig.width || '*'}}px × {{imgConfig.height || '*'}}px（按照实际设计图尺寸）</p>
          <p>2.文件大小不可超过10M</p>
          <p>3.支持扩展名：.jpg .png</p>
        </template>
      </el-upload>
    </template>
    <template v-else>
      <div class="re-upload">
        <PreviewImg :img="imgPath"/>
        <el-button size="small" type="primary" @click="reupload">重新上传</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import PreviewImg from '@/components/common/PreviewImg.vue';
import midApi from '@/apis/mid';
import { ElMessage } from 'element-plus';
import type { UploadUserFile, UploadFile, UploadFiles, UploadInstance } from 'element-plus';

type ImgConfigType = {
  width: number,
  height: number
};
type PropsType = {
  imgConfig: ImgConfigType,
};
const props = defineProps<PropsType>();
const { imgConfig } = toRefs(props);

const imgPath = defineModel<string>();
const canUpload = ref(false);
const upload = ref<UploadInstance>();
const outFileList = ref<UploadUserFile[]>([]);

const beforeUploadImg = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
  const isPNG = file.type === 'image/png';
  const isICO = file.type === 'image/x-icon';
  const isPG = (isJPG || isPNG || isICO);
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isPG) {
    ElMessage.error('请上传图片类型，仅支持png/jpg/jpeg/ico格式');
    throw('请上传图片类型，仅支持png/jpg/jpeg格式');
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能大于10M');
    throw('图片大小不能大于10M');
  }
  const imgSrc = URL.createObjectURL(file);
  const imgTemp = new Image();
  imgTemp.src = imgSrc;

  if (imgConfig.value.width && imgConfig.value.height) {
    const result = new Promise((resolve, reject) => {
      imgTemp.onload = () => {
        if ((imgTemp.width / imgTemp.height) === (imgConfig.value.width / imgConfig.value.height)) {
          resolve(true);
        } else {
          ElMessage.error(`请上传宽高比为 ${imgConfig.value.width}px : ${imgConfig.value.height}px 及同等比例的图片`);
          reject(false);
        }
      };
    });
    return result;
  } else if (imgConfig.value.width) {
    const result = new Promise((resolve, reject) => {
      imgTemp.onload = () => {
        if (imgTemp.width % imgConfig.value.width === 0) {
          resolve(true);
        } else {
          ElMessage.error(`请上传宽度比为 ${imgConfig.value.width}px 及同等比例的图片`);
          reject(false);
        }
      };
    });
    return result;
  } else if (imgConfig.value.height) {
    const result = new Promise((resolve, reject) => {
      imgTemp.onload = () => {
        if (imgTemp.height % imgConfig.value.height === 0) {
          resolve(true);
        } else {
          ElMessage.error(`请上传高度比为 ${imgConfig.value.height}px 及同等比例的图片`);
          reject(false);
        }
      };
    });
    return result;
  } else {
    return isPG && isLt10M;
  }
};

type FileType = {
  file: File
};
const uploadSmallImg = async ({ file }: FileType) => {
  try {
    let formData = new FormData();
    formData.append('file', file);
    let data = await midApi.uploadFile(formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    imgPath.value = data;
  } catch (e) {
    console.log(e);
  }
};

const reupload = () => {
  imgPath.value = '';
  canUpload.value = true;
};

const handleChange = (file: UploadFile, fileList: UploadFiles) => {
  // 上传成功且为图片类型，则只显示第一张图片
  if (fileList.length > 1) {
    fileList.splice(0, 1);
  }
  outFileList.value = fileList;
};

watch(imgPath, (val) => {
  if (val) {
    canUpload.value = false;
  } else {
    canUpload.value = true;
    outFileList.value = [];
  }
}, {
  immediate: true
});

</script>