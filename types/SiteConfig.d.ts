
// 网站配置类型
export type SiteConfigType = {
  site: {
    title: string
    description: string
    version: string
  },
  season: Array<{
    name: string
    color: string
    home: string
    footer: string
    flower: string
  }>,
  userinfo: {
    username: string
    avatar: string
    motto: string[]
    contact: {
      qq: string
      email: string
      yuque: string
      csdn: string
    }
    hobbies: string[]
    about: string
    skill: Array<{
      label: string
      value: string[]
    }>
  },
	project: Array<{
		name: string
		cover: string
		description: string
		details: string
	}>
}