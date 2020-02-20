// menu.js：菜单相关的接口模拟

// 获取菜单树


export function findTree() {
  const navTreeData = {
    "code": 200,
    "msg": null,
    "data": [
      {
        "id": 1,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 0,
        "name": "系统管理",
        "url": null,
        "perms": null,
        "type": 0,
        "icon": "fa el-icon-setting",
        "orderNum": 0,
        "delFlag": 0,
        "children": [
          {
            "id": 2,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "用户管理",
            "url": "/sys/user",
            "perms": null,
            "type": 1,
            "icon": "el-icon-service",
            "orderNum": 1,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 3,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "机构管理",
            "url": "/sys/dept",
            "perms": null,
            "type": 1,
            "icon": "el-icon-news",
            "orderNum": 2,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 4,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "角色管理",
            "url": "/sys/role",
            "perms": null,
            "type": 1,
            "icon": "el-icon-view",
            "orderNum": 4,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 5,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "菜单管理",
            "url": "/sys/menu",
            "perms": null,
            "type": 1,
            "icon": "el-icon-menu",
            "orderNum": 5,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 6,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "SQL监控",
            "url": "/druid/sql",
            "perms": null,
            "type": 1,
            "icon": "el-icon-info",
            "orderNum": 6,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 7,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "字典管理",
            "url": "/sys/dict",
            "perms": null,
            "type": 1,
            "icon": "el-icon-edit-outline",
            "orderNum": 7,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 8,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 1,
            "name": "系统日志",
            "url": "/sys/log",
            "perms": "sys:log:view",
            "type": 1,
            "icon": "el-icon-info",
            "orderNum": 7,
            "delFlag": 0,
            "children": []
          }
        ]
      },
      {
        "id": 25,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 0,
        "name": "内容管理",
        "url": null,
        "perms": null,
        "type": 0,
        "icon": "el-icon-document",
        "orderNum": 0,
        "delFlag": 0,
        "children": [
          {
            "id": 26,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 25,
            "name": "栏目管理",
            "url": "/content/category",
            "perms": null,
            "type": 1,
            "icon": "el-icon-tickets",
            "orderNum": 1,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 27,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 25,
            "name": "文章管理",
            "url": "/content/artical",
            "perms": null,
            "type": 1,
            "icon": "el-icon-tickets",
            "orderNum": 2,
            "delFlag": 0,
            "children": []
          }
        ]
      },
      {
        "id": 28,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 0,
        "name": "使用案例",
        "url": null,
        "perms": null,
        "type": 0,
        "icon": "el-icon-picture-outline",
        "orderNum": 0,
        "delFlag": 0,
        "children": [
          {
            "id": 29,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 28,
            "name": "国际化",
            "url": "/demo/i18n",
            "perms": null,
            "type": 1,
            "icon": "el-icon-edit",
            "orderNum": 1,
            "delFlag": 0,
            "children": []
          },
          {
            "id": 30,
            "createBy": null,
            "createTime": null,
            "lastUpdateBy": null,
            "lastUpdateTime": null,
            "parentId": 28,
            "name": "换皮肤",
            "url": "/demo/theme",
            "perms": null,
            "type": 1,
            "icon": "el-icon-picture",
            "orderNum": 2,
            "delFlag": 0,
            "children": []
          }
        ]
      }
    ]
  }
  return {
    url: 'findNavTree',
    type: 'get',
    data: navTreeData
  }
}
