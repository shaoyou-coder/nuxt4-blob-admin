<template>
  <div class="site-wrap">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" :label-position="labelPosition" label-width="150">
			<el-divider content-position="left">网站基本配置</el-divider>
			<el-form-item label="网站名称" prop="site.title" style="max-width: 300px;">
				<el-input v-model="form.site.title" />
			</el-form-item>
			<el-form-item label="网站描述" prop="site.description" style="max-width: 600px;">
				<el-input v-model="form.site.description" />
			</el-form-item>
			<el-form-item label="网站版本号" prop="site.version" style="max-width: 300px;">
				<el-input v-model="form.site.version" />
			</el-form-item>
			<el-divider content-position="left">四季主题配置</el-divider>
			<el-tabs v-model="seasonTabIndex">
				<el-tab-pane v-for="(season, index) in form.season" :key="season.name" :label="season.name" :name="index">
					<el-form-item label="主题色" :prop="`season[${index}].color`" :rules="rules.seasonColor" style="max-width: 300px;">
						<el-color-picker v-model="season.color" show-alpha />
					</el-form-item>
					<el-form-item label="首页背景图" :prop="`season[${index}].home`" :rules="rules.seasonHome">
						<UploadImgComp v-model="season.home" :imgConfig="{ width: 0, height: 0 }" />
					</el-form-item>
					<el-form-item label="页脚背景图" :prop="`season[${index}].footer`">
						<UploadImgComp v-model="season.footer" :imgConfig="{ width: 0, height: 0 }" />
					</el-form-item>
					<el-form-item label="花瓣图标" :prop="`season[${index}].flower`" :rules="rules.seasonFlower">
						<UploadImgComp v-model="season.flower" :imgConfig="{ width: 0, height: 0 }" />
					</el-form-item>
				</el-tab-pane>
			</el-tabs>
			<el-divider content-position="left">个人信息配置</el-divider>
			<el-form-item label="笔名" prop="userinfo.username" style="max-width: 300px;">
				<el-input v-model="form.userinfo.username" />
			</el-form-item>
			<el-form-item label="头像" prop="userinfo.avatar" style="max-width: 300px;">
				<UploadImgComp v-model="form.userinfo.avatar" :imgConfig="{ width: 0, height: 0 }" />
			</el-form-item>
			<el-form-item label="座右铭" prop="userinfo.motto" style="max-width: 600px;">
				<el-input-tag v-model="form.userinfo.motto" :max="3" placeholder="请输入座右铭" />
			</el-form-item>
			<el-form-item label="兴趣爱好" prop="userinfo.hobbies" style="max-width: 600px;">
				<el-input-tag v-model="form.userinfo.hobbies" placeholder="请输入兴趣爱好" />
			</el-form-item>
			<el-form-item label="联系方式（QQ）" prop="userinfo.contact.qq" style="max-width: 600px;">
				<el-input v-model="form.userinfo.contact.qq" />
			</el-form-item>
			<el-form-item label="联系方式（邮箱）" prop="userinfo.contact.email" style="max-width: 600px;">
				<el-input v-model="form.userinfo.contact.email" />
			</el-form-item>
			<el-form-item label="联系方式（语雀）" prop="userinfo.contact.yuque" style="max-width: 600px;">
				<el-input v-model="form.userinfo.contact.yuque" />
			</el-form-item>
			<el-form-item label="联系方式（CSDN）" prop="userinfo.contact.csdn" style="max-width: 600px;">
				<el-input v-model="form.userinfo.contact.csdn" />
			</el-form-item>
			<el-form-item label="专业技能" prop="userinfo.skill" :rules="rules.skill">
				<div class="skill">
					<el-tabs v-model="skillTabIndex">
						<el-tab-pane v-for="(skill, index) in form.userinfo.skill" :key="skill.label" :label="skill.label" :name="index">
							<div class="skill-item">
								<el-tag
									v-for="(tag, tagIndex) in skill.value"
									:key="tagIndex"
									closable
									class="skill-tag"
									@close="removeTag(index, tagIndex)"
									@click="editTag(index, tagIndex)"
								>
									{{ tag }}
								</el-tag>
								<!-- 添加新标签的输入框 -->
								<el-input
									v-if="inputVisible[index]"
									ref="inputRef"
									v-model="inputValue[index]"
									class="input-new-tag"
									size="small"
									@keyup.enter="addTag(index)"
									@blur="addTag(index)"
								/>
								<el-button
									v-else
									class="button-new-tag"
									size="small"
									@click="showInput(index)"
								>
									+ 新技能
								</el-button>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-form-item>
			<el-form-item label="关于我" prop="userinfo.about">
				<div style="z-index: 1001; position: relative;">
					<WangEditor v-model="form.userinfo.about"></WangEditor>
				</div>
			</el-form-item>
			<el-divider content-position="left">开源&项目配置</el-divider>
			<el-tabs
				v-model="projectTabIndex"
				editable
				class="demo-tabs"
				@edit="handleTabsEdit"
			>
				<el-tab-pane
					v-for="(project, index) in form.project"
					:key="index"
					:label="project.name"
					:name="index"
				>
					<el-form-item label="项目名称" :prop="`project[${index}].name`" :rules="rules.projectName" style="max-width: 300px;">
						<el-input v-model="project.name" />
					</el-form-item>
					<el-form-item label="项目描述" :prop="`project[${index}].description`" :rules="rules.projectDescription" style="max-width: 600px;">
						<el-input v-model="project.description" />
					</el-form-item>
					<el-form-item label="项目封面" :prop="`project[${index}].cover`" :rules="rules.projectCover">
						<UploadImgComp v-model="project.cover" :imgConfig="{ width: 0, height: 0 }" />
					</el-form-item>
					<el-form-item label="项目详情" :prop="`project[${index}].details`" :rules="rules.projectDetails">
						<div style="z-index: 1001; position: relative;">
							<WangEditor v-model="project.details"></WangEditor>
						</div>
					</el-form-item>
				</el-tab-pane>
			</el-tabs>
		</el-form>
		<div class="opts-wrap">
			<el-button type="primary" @click="submitForm(ruleFormRef)">
				保存
			</el-button>
		</div>
  </div>
</template>

<script setup lang="ts">
import midApi from '@/apis/mid';
import { isMobile } from '@/utils/commonUtils';
import type { SiteConfigType } from '#types/SiteConfig';
import type { FormInstance, FormRules, TabPaneName  } from 'element-plus';
import { ElMessage } from 'element-plus';
import WangEditor from '@/components/common/WangEditor.vue';
import UploadImgComp from '@/components/common/UploadImgComp.vue';

const getSiteConfig = async () => {
	const data = await midApi.getSiteConfig();
	Object.assign(form, data);
};

onMounted(() => {
	getSiteConfig();
});

const seasonTabIndex = ref(0);

const skillTabIndex = ref(0);
const inputVisible = ref<Record<string, any>>({});
const inputValue = ref<Record<string, any>>({});
const inputRef = ref();

const projectTabIndex = ref(0);

const labelPosition = computed(() => {
	return isMobile() === true ? 'top' : 'right';
});
const ruleFormRef = ref<FormInstance>();
const form = reactive<SiteConfigType>({
	site: {
		title: '',
		description: '',
		version: '',
	},
	season: [],
	userinfo: {
		username: '',
		avatar: '',
		motto: [],
		contact: {
			qq: '',
			email: '',
			yuque: '',
			csdn: '',
		},
		hobbies: [],
		about: '',
		skill: [],
	},
  project: [],
});
const rules = reactive<FormRules>({
	'site.title': [{ required: true, message: '请输入网站名称', trigger: ['blur', 'change'] }],
	'site.description': [{ required: true, message: '请输入网站描述', trigger: ['blur', 'change'] }],
	'seasonColor': [{ required: true, message: '请选择主题色', trigger: ['blur', 'change'] }],
	'seasonHome': [{ required: true, message: '请上传首页背景图', trigger: ['blur', 'change'] }],
	'seasonFlower': [{ required: true, message: '请上传花瓣图标', trigger: ['blur', 'change'] }],
	'userinfo.username': [{ required: true, message: '请输入笔名', trigger: ['blur', 'change'] }],
	'userinfo.avatar': [{ required: true, message: '请上传头像', trigger: ['blur', 'change'] }],
	'userinfo.motto': [{ required: true, message: '请输入座右铭', trigger: ['blur', 'change'] }],
	'userinfo.hobbies': [{ required: true, message: '请输入兴趣爱好', trigger: ['blur', 'change'] }],
	'userinfo.contact.qq': [{ required: true, message: '请输入QQ', trigger: ['blur', 'change'] }],
	'userinfo.contact.email': [{ required: true, message: '请输入邮箱', trigger: ['blur', 'change'] }],
	'userinfo.contact.yuque': [{ required: true, message: '请输入语雀个人主页地址', trigger: ['blur', 'change'] }],
	'userinfo.contact.csdn': [{ required: true, message: '请输入CSDN个人主页地址', trigger: ['blur', 'change'] }],
	'userinfo.about': [
		{
			required: true,
      validator: (rule, value, callback) => {
				console.log(value);
        if (!value || value === '<p><br></p>') {
          callback(new Error('请输入关于我的信息'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
	],
	skill: [
    {
			required: true,
      validator: (rule, value, callback) => {
        // value 是整个 skill 数组
        if (!value || value.length === 0) {
          return callback(new Error('至少需要一个技能分类'));
        }
        // 检查每个分类是否至少有一个技能
        for (let i = 0; i < value.length; i++) {
          const skillItem = value[i];
          if (!skillItem.value || skillItem.value.length === 0) {
            return callback(new Error(`"${skillItem.label}" 分类下至少需要一个技能`));
          }
        }
        callback();
      },
      trigger: ['blur', 'change']
    }
  ],
	projectName: [
		{
			required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入项目名称'));
        }
        callback();
      },
      trigger: ['blur', 'change']
    }
	],
	projectDescription: [
		{
			required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入项目描述'));
        }
        callback();
      },
      trigger: ['blur', 'change']
    }
	],
	projectCover: [
		{
			required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请上传项目封面'));
        }
        callback();
      },
      trigger: ['blur', 'change']
    }
	],
	projectDetails: [
		{
			required: true,
      validator: (rule, value, callback) => {
        if (!value || value === '<p><br></p>') {
          return callback(new Error('请输入项目详情'));
        }
        callback();
      },
      trigger: ['blur', 'change']
    }
	]
});

// 添加标签
const addTag = (tabIndex: number) => {
  const value = inputValue.value[tabIndex]?.trim();
  if (value) {
    form.userinfo.skill[tabIndex].value.push(value);
  }
  inputVisible.value[tabIndex] = false;
  inputValue.value[tabIndex] = '';
};

// 显示输入框
const showInput = (tabIndex: number) => {
  inputVisible.value[tabIndex] = true;
  inputValue.value[tabIndex] = '';
  nextTick(() => {
    inputRef.value[0]?.focus();
  });
};

// 编辑标签
const editTag = (tabIndex: number, tagIndex: number) => {
  const currentTag = form.userinfo.skill[tabIndex].value[tagIndex];

  // 先移除原标签
  form.userinfo.skill[tabIndex].value.splice(tagIndex, 1);

  // 显示输入框并设置原值
  inputVisible.value[tabIndex] = true;
  inputValue.value[tabIndex] = currentTag;

  nextTick(() => {
    inputRef.value[0]?.focus();
  });
};

// 删除标签
const removeTag = (tabIndex: number, tagIndex: number) => {
  form.userinfo.skill[tabIndex].value.splice(tagIndex, 1);
};

const handleTabsEdit = (
  targetName: TabPaneName | undefined,
  action: 'remove' | 'add'
) => {
  if (action === 'add') {
    const newTabName = form.project.length;
    form.project.push({
      name: '新项目',
			description: '新项目描述',
			cover: '',
			details: '',
    });
    projectTabIndex.value = newTabName;
  } else if (action === 'remove') {
    const tabs = form.project;
    let activeName = projectTabIndex.value;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (index === targetName) {
          const nextTab = tabs[index + 1];
					const beforeTab =  tabs[index - 1];
          if (nextTab) {
            activeName = index + 1;
          }
					if (beforeTab) {
						activeName = index - 1;
					}
        }
      });
    }

    projectTabIndex.value = activeName;
    form.project = tabs.filter((tab, index) => index !== targetName);
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
	console.log(form);
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!');
			await midApi.setSiteConfig({ config: form });
			ElMessage.success({ message: '保存成功' });
    } else {
      console.log('error submit!', fields);
			ElMessage.success({ message: '保存失败' });
    }
  });
};
</script>

<style lang="less" scoped>
.site-wrap {
  padding: 10px;
}
:deep(.el-divider) {
	margin: 50px 0;
}
:deep(.el-divider__text) {
	font-size: 18px;
}
.skill {
	width: 100%;
	overflow: auto;
	:deep(.el-tabs__nav) {
		margin: 0;
	}
	.skill-item {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
}
.opts-wrap {
	display: flex;
	justify-content: flex-end;
	padding: 20px 0;
}
</style>