# 🇦🇺 澳大利亚留学指南

一站式澳大利亚留学信息网站，帮助中国学生了解澳洲大学、城市、打工和就业信息。

**在线访问：** https://liaocyintl.github.io/australia_study/

## 功能模块

| 模块 | 说明 |
|------|------|
| **大学地图** | 37 所大学互动地图，含 QS 排名、学费、分组筛选（Go8/ATN/IRU/RUN） |
| **城市指南** | 15 座城市详情，人口、产业、收入与生活成本对比 |
| **打工指南** | 16 种兼职岗位薪资、收入计算器、学生签证/WHV/毕业签证详解 |
| **就业指南** | 15 个行业薪酬概况、23 家知名雇主、签证担保信息 |

## 技术栈

- 纯静态 HTML / CSS / JavaScript（无框架、无构建工具）
- SPA 架构，hash 路由，ES modules 懒加载
- [Leaflet.js](https://leafletjs.com/) + [CARTO](https://carto.com/) 底图
- 数据与展示分离（`data/*.json`）
- GitHub Pages 部署

## 项目结构

```
index.html              # SPA 外壳
js/
  router.js             # Hash 路由
  universities.js       # 大学地图模块
  cities.js             # 城市指南模块
  work.js               # 打工指南模块
  career.js             # 就业指南模块
css/
  base.css              # 共享样式
  universities.css
  cities.css
  work.css
  career.css
data/
  universities.json     # 37 所大学数据
  cities.json           # 15 座城市数据
  jobs.json             # 16 种兼职岗位数据
  visas.json            # 签证信息数据
  industries.json       # 15 个行业数据
  companies.json        # 23 家公司数据
```

## 本地运行

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 免责声明

本站内容仅供参考，所有数据为近似值，具体信息请以各大学官网及澳大利亚政府官方网站为准。
