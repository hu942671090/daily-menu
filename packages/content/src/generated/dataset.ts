/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// 由 packages/content/scripts/compile-data.mjs 生成，请修改 data/*.json 后重新运行 npm run data:build。

import type { Recipe, RecipeVideo } from '@daily-menu/shared';

export const DATASET_META = {
  "generatedAt": "2026-10-19T07:38:25.107Z",
  "recipeCount": 25,
  "videoCount": 24,
  "verifiedVideoCount": 24,
  "cuisineCount": 8,
  "mealCounts": {
    "breakfast": 7,
    "lunch": 11,
    "dinner": 15
  },
  "schemaVersion": 1
} as const;

export const RECIPES: Recipe[] = [
  {
    "id": "braised-pork",
    "name": "红烧肉",
    "subtitle": "冰糖炒色，小火慢焖",
    "intro": "红烧肉好吃在于糖色炒得匀、火候压得住。五花肉先煸出油，再用冰糖炒出的琥珀色裹住每块肉，加热水小火焖足一小时，最后大火收汁，肉皮发亮、入口软糯，适合周末慢慢做上一锅。",
    "cuisine": "家常菜",
    "tastes": [
      "酱香",
      "微甜"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 3,
    "prepMinutes": 15,
    "cookMinutes": 80,
    "difficulty": 3,
    "image": {
      "src": "/images/recipes/braised-pork.png",
      "alt": "红烧肉成品示意图：砂锅中酱红色肉块泛着油光，表面撒白芝麻",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "带皮五花肉",
      "姜",
      "大葱",
      "八角",
      "桂皮"
    ],
    "allergenTags": [
      "猪肉",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "pork-belly",
            "name": "带皮五花肉",
            "amount": 750,
            "unit": "克",
            "scalable": true,
            "note": "切 3 厘米见方的块"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 4,
            "unit": "片",
            "scalable": true
          },
          {
            "id": "scallion",
            "name": "大葱",
            "amount": 1,
            "unit": "段",
            "scalable": true,
            "note": "切两段即可"
          },
          {
            "id": "star-anise",
            "name": "八角",
            "amount": 2,
            "unit": "个",
            "scalable": true
          },
          {
            "id": "cinnamon",
            "name": "桂皮",
            "amount": 1,
            "unit": "块",
            "scalable": true,
            "note": "约 3 厘米长"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "rock-sugar",
            "name": "冰糖",
            "amount": 40,
            "unit": "克",
            "scalable": true,
            "note": "炒糖色用"
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 30,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "dark-soy",
            "name": "老抽",
            "amount": 10,
            "unit": "毫升",
            "scalable": true,
            "note": "补色，不要多放"
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 30,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 3 克（按口味添加）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 15,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "hot-water",
            "name": "热水",
            "amount": 900,
            "unit": "毫升",
            "scalable": true,
            "note": "必须用热水"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "五花肉切块焯水",
        "text": "五花肉用温水冲洗，刮净皮上的杂质，切成三厘米见方的块。冷水下锅，加两片姜和一半料酒，大火煮开撇去浮沫，再煮三分钟捞出。",
        "image": {
          "src": "/images/recipes/braised-pork-step-1.png",
          "alt": "步骤 1 示意图：锅中五花肉块焯水，表面浮着浮沫，旁边是切好的肉块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "大火"
      },
      {
        "index": 2,
        "title": "干煸逼出油脂",
        "text": "锅烧干，把肉块皮朝下码入锅中，中小火慢慢煸，把肥肉里的油逼出来。煸到四面微黄、锅底积出一层油，盛出肉块，多余的油倒掉。",
        "image": {
          "src": "/images/recipes/braised-pork-step-2.png",
          "alt": "步骤 2 示意图：铁锅中肉块皮朝下贴着锅底，边缘已被煸成金黄",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "中小火"
      },
      {
        "index": 3,
        "title": "小火炒出糖色",
        "text": "锅里留少许底油，转小火放入冰糖，用铲子不停搅动。糖先结块再融化，等颜色变成枣红、表面冒起细密小泡时立刻下肉。",
        "image": {
          "src": "/images/recipes/braised-pork-step-3.png",
          "alt": "步骤 3 示意图：锅底糖浆融化成枣红色并冒小泡，铲子正在搅动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 3 分钟",
        "heat": "小火"
      },
      {
        "index": 4,
        "title": "肉块裹匀糖色",
        "text": "把肉块倒回锅中快速翻炒，让每一面都裹上糖色，再加姜片、葱段、八角和桂皮，炒到香味出来、肉块表面收紧。",
        "image": {
          "src": "/images/recipes/braised-pork-step-4.png",
          "alt": "步骤 4 示意图：肉块在锅中翻炒并裹上红亮糖色，旁边有八角桂皮",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "中火"
      },
      {
        "index": 5,
        "title": "加热水小火慢焖",
        "text": "沿锅边淋入料酒，加生抽、老抽翻匀，倒入没过肉块的热水。大火烧开后转最小火，盖盖焖六十分钟，中途翻动一次。",
        "image": {
          "src": "/images/recipes/braised-pork-step-5.png",
          "alt": "步骤 5 示意图：砂锅中肉块浸在深色汤汁里，水面微微冒泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 60 分钟",
        "heat": "小火"
      },
      {
        "index": 6,
        "title": "大火收汁亮油",
        "text": "挑出葱姜和香料，尝味后补盐。转中大火收汁，边收边翻动，等汤汁变浓、能挂在肉上并泛出亮光时关火。",
        "image": {
          "src": "/images/recipes/braised-pork-step-6.png",
          "alt": "步骤 6 示意图：锅中汤汁收浓挂在肉块上，肉皮泛出油亮的红光",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 10 分钟",
        "heat": "中大火"
      }
    ],
    "tips": [
      "炖煮时一定加热水，冷水会让肉块骤然收缩，炖出来发硬。",
      "炒糖色宁浅勿深，枣红色就下肉，再炒几秒就会发苦。",
      "焖煮全程保持水面微微冒泡，火太大肉容易散，汤也容易干。"
    ],
    "substitutions": [
      "冰糖可换成等量白糖，但炒色速度更快，要更早下肉。",
      "没有桂皮可以省略，换成一小块陈皮也别有风味。",
      "五花肉可换成梅花肉，油脂少一些，煸油时间相应缩短。"
    ],
    "failures": [
      "糖色发苦：冰糖炒过头焦化；颜色变枣红立刻下肉，动作要快。",
      "肉质发柴：中途加了冷水或一直大火翻滚；用热水并保持小火微沸。",
      "颜色发黑不发亮：老抽放多或收汁太久；老抽只用来补色，收汁到挂勺即可。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "century-egg-pork-porridge",
    "name": "皮蛋瘦肉粥",
    "subtitle": "米粒开花的广式咸粥",
    "intro": "大米提前泡过，用少许油盐拌一拌再煮，米粒更容易开花。猪里脊切细丝滑熟，皮蛋分两次下锅，一半煮化进粥里、一半最后放保留口感。适合周末早晨慢慢煮一锅，也可以提前一晚把料备好。",
    "cuisine": "粤式",
    "tastes": [
      "咸鲜",
      "鲜香"
    ],
    "mealTypes": [
      "breakfast"
    ],
    "baseServings": 2,
    "prepMinutes": 25,
    "cookMinutes": 50,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/century-egg-pork-porridge.png",
      "alt": "皮蛋瘦肉粥成品示意图：白粥中可见皮蛋块、肉丝与姜丝，撒有葱花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "大米",
      "猪里脊",
      "皮蛋",
      "姜"
    ],
    "allergenTags": [
      "猪肉",
      "鸡蛋"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "rice",
            "name": "大米",
            "amount": 100,
            "unit": "克",
            "scalable": true,
            "note": "提前浸泡 30 分钟"
          },
          {
            "id": "pork-tenderloin",
            "name": "猪里脊",
            "amount": 120,
            "unit": "克",
            "scalable": true,
            "note": "逆纹切细丝"
          },
          {
            "id": "century-egg",
            "name": "皮蛋",
            "amount": 2,
            "unit": "个",
            "scalable": true,
            "note": "去壳切小块"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 1,
            "unit": "块",
            "scalable": true,
            "note": "一半切丝、一半切片"
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 1200,
            "unit": "毫升",
            "scalable": true,
            "note": "煮粥用"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "约 3 克（分两次放）",
            "scalable": false
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "腌肉丝用"
          },
          {
            "id": "starch",
            "name": "淀粉",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "腌肉丝，让肉丝滑嫩"
          },
          {
            "id": "white-pepper",
            "name": "白胡椒粉",
            "amount": null,
            "unit": "克",
            "display": "少许",
            "scalable": false
          },
          {
            "id": "sesame-oil",
            "name": "香油",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "出锅前淋"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "拌米用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "大米浸泡后拌油盐",
        "text": "大米淘洗两遍，加清水浸泡 30 分钟，沥干后拌入 1 茶匙食用油和一小撮盐，静置 10 分钟。米粒裹上油，煮的时候更容易开花。",
        "image": {
          "src": "/images/recipes/century-egg-pork-porridge-step-1.png",
          "alt": "步骤 1 示意图：碗中泡好的大米正被拌入食用油与盐",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 40 分钟"
      },
      {
        "index": 2,
        "title": "肉丝上浆、皮蛋切块",
        "text": "里脊逆纹切细丝，加生抽、淀粉和两勺清水抓匀，腌 10 分钟；皮蛋去壳切成小块，姜一半切丝、一半切片。",
        "image": {
          "src": "/images/recipes/century-egg-pork-porridge-step-2.png",
          "alt": "步骤 2 示意图：碗中腌好的肉丝、案板上切好的皮蛋块与姜丝",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 12 分钟"
      },
      {
        "index": 3,
        "title": "大火煮开转小火",
        "text": "锅中放 1200 毫升水和姜片，大火烧开后倒入大米，用勺子搅散，再次沸腾后转小火，锅盖留缝，煮 30 分钟。",
        "image": {
          "src": "/images/recipes/century-egg-pork-porridge-step-3.png",
          "alt": "步骤 3 示意图：锅中米粒翻滚，锅盖斜留一条缝隙",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火转小火",
        "timeHint": "约 35 分钟"
      },
      {
        "index": 4,
        "title": "下皮蛋煮化一半",
        "text": "把一半皮蛋放进粥里，用勺子背轻轻压碎，让它在小火上滚 10 分钟，香味会慢慢融进粥底；期间每 5 分钟搅一次锅底。",
        "image": {
          "src": "/images/recipes/century-egg-pork-porridge-step-4.png",
          "alt": "步骤 4 示意图：勺子背正把锅中的皮蛋块压碎进粥里",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 10 分钟"
      },
      {
        "index": 5,
        "title": "分散下肉丝滑熟",
        "text": "转中火，把腌好的肉丝抖散、一缕一缕下锅，下完等 10 秒再搅动，肉丝定型后推散，煮到完全变色即可。",
        "image": {
          "src": "/images/recipes/century-egg-pork-porridge-step-5.png",
          "alt": "步骤 5 示意图：筷子把肉丝一缕缕抖散放入微沸的粥中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 6,
        "title": "调味撒皮蛋姜丝",
        "text": "加盐和白胡椒粉调味，关火后放入剩下的皮蛋和姜丝，淋香油，盖盖焖 2 分钟，盛碗时再撒一点葱花。",
        "image": {
          "src": "/images/recipes/century-egg-pork-porridge-step-6.png",
          "alt": "步骤 6 示意图：粥面摆着皮蛋块与姜丝，香油正沿碗边淋下",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 3 分钟"
      }
    ],
    "tips": [
      "大米泡过再拌油，煮出来米粒完整、粥体绵滑，不容易糊成一团。",
      "皮蛋分两次放：先放的一半压碎煮化提味，后放的一半保留块状口感。",
      "肉丝下锅后先别搅，等表面变白再推散，否则容易脱浆、粥变浑。"
    ],
    "substitutions": [
      "猪里脊可换成鸡胸肉或瘦牛肉，切丝后同样上浆，煮的时间缩短 30 秒。",
      "没有皮蛋可用 1 个咸鸭蛋替代，蛋黄压碎入粥，盐量要相应减少。",
      "想更省事可用电饭煲的煮粥档，米水比例不变，最后 10 分钟开盖加料。"
    ],
    "failures": [
      "粥不稠、米是米水是水：米没泡或一直大火；泡 30 分钟并转小火慢煮。",
      "肉丝发柴、粘成团：下锅前没抖散，或煮得太久；一缕一缕下，变色就关火。",
      "皮蛋味发涩：皮蛋放太早、煮得过久；留一半关火后再放。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "egg-veggie-pancake",
    "name": "蔬菜鸡蛋饼",
    "subtitle": "一张饼里有蛋也有菜",
    "intro": "面粉加鸡蛋调成能流动的面糊，拌进胡萝卜丝和葱花，中小火摊成薄饼，两面金黄就能出锅。饼皮软而有韧性，胡萝卜带一点清甜，咸淡可以自己调。适合两三个人的早餐，切成条也能当便当配菜。",
    "cuisine": "家常菜",
    "tastes": [
      "咸鲜",
      "鲜香"
    ],
    "mealTypes": [
      "breakfast"
    ],
    "baseServings": 2,
    "prepMinutes": 12,
    "cookMinutes": 8,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/egg-veggie-pancake.png",
      "alt": "蔬菜鸡蛋饼成品示意图：金黄色的薄饼切段叠放在盘中，可见胡萝卜丝与葱花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "鸡蛋",
      "面粉",
      "胡萝卜",
      "小葱"
    ],
    "allergenTags": [
      "鸡蛋",
      "麸质"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "egg",
            "name": "鸡蛋",
            "amount": 2,
            "unit": "个",
            "scalable": true,
            "note": "打散"
          },
          {
            "id": "flour",
            "name": "中筋面粉",
            "amount": 100,
            "unit": "克",
            "scalable": true,
            "note": "过筛更细腻"
          },
          {
            "id": "carrot",
            "name": "胡萝卜",
            "amount": 1,
            "unit": "根",
            "scalable": true,
            "note": "约 100 克，擦细丝"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 2,
            "unit": "根",
            "scalable": true,
            "note": "切葱花"
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 150,
            "unit": "毫升",
            "scalable": true,
            "note": "分次加入，调成可流动的面糊"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "约 2 克（按口味）",
            "scalable": false
          },
          {
            "id": "white-pepper",
            "name": "白胡椒粉",
            "amount": null,
            "unit": "克",
            "display": "一小撮",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 15,
            "unit": "毫升",
            "scalable": true,
            "note": "刷锅用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "胡萝卜擦丝、葱切花",
        "text": "胡萝卜削皮，用擦丝器擦成细丝；小葱洗净甩干，切成葱花。胡萝卜丝太长的话用刀改两下，摊饼时不容易把面糊划破。",
        "image": {
          "src": "/images/recipes/egg-veggie-pancake-step-1.png",
          "alt": "步骤 1 示意图：案板上擦好的胡萝卜丝与切好的葱花",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 4 分钟"
      },
      {
        "index": 2,
        "title": "调一碗顺滑面糊",
        "text": "大碗里放 100 克面粉，先加 150 毫升清水，用筷子朝一个方向搅到没有干粉，再打入 2 个鸡蛋搅匀，面糊能挂住筷子又慢慢往下流。",
        "image": {
          "src": "/images/recipes/egg-veggie-pancake-step-2.png",
          "alt": "步骤 2 示意图：碗中面糊被筷子挑起，缓缓向下流",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 3,
        "title": "拌入蔬菜和调味",
        "text": "把胡萝卜丝、葱花倒进面糊，加盐和白胡椒粉，拌匀后静置 5 分钟，让面粉充分吸水；如果面糊变稠，补一到两勺清水。",
        "image": {
          "src": "/images/recipes/egg-veggie-pancake-step-3.png",
          "alt": "步骤 3 示意图：胡萝卜丝与葱花拌入面糊，筷子正在搅动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 5 分钟"
      },
      {
        "index": 4,
        "title": "中小火摊成薄饼",
        "text": "平底锅烧热，刷一层薄油，舀一勺面糊倒进锅中间，立刻端起锅转圈，让面糊摊成薄薄一层；表面凝固、边缘翘起时就可以翻面。",
        "image": {
          "src": "/images/recipes/egg-veggie-pancake-step-4.png",
          "alt": "步骤 4 示意图：平底锅中面糊摊开成圆饼，边缘微微翘起",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中小火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 5,
        "title": "两面煎黄卷起切段",
        "text": "翻面后再煎 1 分钟，饼身鼓起、两面呈浅金黄即可出锅；卷起来切成两指宽的段，趁热吃，凉了会变软。",
        "image": {
          "src": "/images/recipes/egg-veggie-pancake-step-5.png",
          "alt": "步骤 5 示意图：煎好的鸡蛋饼卷起后切成段，摆在小盘中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中小火",
        "timeHint": "约 3 分钟"
      }
    ],
    "tips": [
      "面糊宁可稀一点，能流动才摊得薄；太稠摊不开，饼会又厚又硬。",
      "每摊一张饼前把锅端离火口刷油，锅太热面糊一下锅就定形，转不开。",
      "翻面前等边缘翘起、表面不再流动，急着翻容易破。"
    ],
    "substitutions": [
      "胡萝卜可换成西葫芦丝或菠菜碎；菠菜要先焯水挤干，避免出水。",
      "面粉可用一半全麦粉替代，需多补 20 毫升清水。",
      "不吃鸡蛋可换成 100 克嫩豆腐压碎，饼的口感会偏软。"
    ],
    "failures": [
      "饼一翻就破：面糊太稠或蔬菜丝太长；把面糊调稀，菜丝改短。",
      "外焦里生：火太大；用中小火，等表面凝固再翻面。",
      "饼发硬：面粉搅拌过度出筋，或煎的时间太长；拌到没有干粉即可，不要反复搅。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "fish-fragrant-eggplant",
    "name": "鱼香茄子",
    "subtitle": "不油炸也入味的茄子",
    "intro": "茄子切条后撒盐腌一会儿，挤掉水分再煎，既能少吃油，也不容易吸成油坨。鱼香汁用糖、醋、生抽和淀粉调好，下锅一收就亮。茄子软糯、汁水酸甜带辣，是很下饭的一道家常川味。",
    "cuisine": "川湘",
    "tastes": [
      "酸甜",
      "香辣"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 15,
    "cookMinutes": 10,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/fish-fragrant-eggplant.png",
      "alt": "鱼香茄子成品示意图：深紫色茄条裹着红亮酱汁，撒有葱花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "长茄子",
      "猪肉末",
      "泡椒"
    ],
    "allergenTags": [
      "猪肉",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "eggplant",
            "name": "长茄子",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约 2 根，切条"
          },
          {
            "id": "minced-pork",
            "name": "猪肉末",
            "amount": 80,
            "unit": "克",
            "scalable": true,
            "note": "肥瘦三七"
          },
          {
            "id": "pickled-chili",
            "name": "泡椒",
            "amount": 3,
            "unit": "个",
            "scalable": true,
            "note": "切碎"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 1,
            "unit": "根",
            "scalable": true,
            "note": "切葱花"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "black-vinegar",
            "name": "香醋",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "starch",
            "name": "淀粉",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true,
            "note": "1 茶匙调汁，1 茶匙备用"
          },
          {
            "id": "doubanjiang",
            "name": "豆瓣酱",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "剁细，可省略"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 1,
            "unit": "块",
            "scalable": true,
            "note": "切末"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 3,
            "unit": "瓣",
            "scalable": true,
            "note": "切末"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "约 2 克（腌茄子用）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 40,
            "unit": "毫升",
            "scalable": true
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "茄子切条撒盐腌",
        "text": "长茄子去蒂，切成 1 厘米粗、6 厘米长的条，撒 2 克盐抓匀，静置 10 分钟；等表面渗出水，用手轻轻挤干，再用厨房纸吸一遍。",
        "image": {
          "src": "/images/recipes/fish-fragrant-eggplant-step-1.png",
          "alt": "步骤 1 示意图：撒了盐的茄条静置在盆中，表面渗出细密水珠",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 12 分钟"
      },
      {
        "index": 2,
        "title": "小碗兑好鱼香汁",
        "text": "小碗里倒 2 茶匙生抽、2 茶匙香醋，加 2 茶匙白糖、1 茶匙淀粉和 4 勺清水，用筷子搅到没有干粉和糖粒。",
        "image": {
          "src": "/images/recipes/fish-fragrant-eggplant-step-2.png",
          "alt": "步骤 2 示意图：小碗中的鱼香汁被筷子搅匀，碗边摆着糖与醋",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 3,
        "title": "少油煎软茄子",
        "text": "平底锅倒 30 毫升油，中火烧热后铺入茄子条，煎 3 分钟再翻面，煎到两面微黄、用筷子能轻松戳透，盛出控油。",
        "image": {
          "src": "/images/recipes/fish-fragrant-eggplant-step-3.png",
          "alt": "步骤 3 示意图：平底锅中茄条一面煎至微黄，筷子正试探软硬",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中火",
        "timeHint": "约 5 分钟"
      },
      {
        "index": 4,
        "title": "炒散肉末下泡椒",
        "text": "锅里留 10 毫升油，下猪肉末中火炒散，炒到肉末发白出油，加泡椒碎、姜蒜末和豆瓣酱，炒出红色油光。",
        "image": {
          "src": "/images/recipes/fish-fragrant-eggplant-step-4.png",
          "alt": "步骤 4 示意图：锅中肉末与泡椒碎同炒，油色渐渐泛红",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 5,
        "title": "茄子回锅裹酱",
        "text": "把煎好的茄子倒回锅里，转大火翻炒 30 秒，让每根茄子都裹上肉末和酱料；太干可以沿锅边淋两勺清水。",
        "image": {
          "src": "/images/recipes/fish-fragrant-eggplant-step-5.png",
          "alt": "步骤 5 示意图：茄条回锅与肉末同炒，酱色逐渐裹匀",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 6,
        "title": "淋汁收浓撒葱花",
        "text": "鱼香汁再搅一下，沿锅边淋入，大火翻到汁水变亮、均匀挂在茄子上，关火撒葱花，趁热装盘。",
        "image": {
          "src": "/images/recipes/fish-fragrant-eggplant-step-6.png",
          "alt": "步骤 6 示意图：鱼香汁在锅中收亮，葱花撒在茄条表面",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "茄子先用盐腌出水再煎，能少吸一半油，口感也更紧实。",
      "煎茄子时不要频繁翻动，一面定型再翻，否则容易碎。",
      "鱼香汁的糖醋比例按 1:1 起步，尝过再微调，醋最后下锅香味才不散。"
    ],
    "substitutions": [
      "长茄子可换成圆茄子，切条后腌 15 分钟，煎的时间延长 1 分钟。",
      "猪肉末可省略，做成素鱼香茄子，豆瓣酱加到 2 茶匙。",
      "泡椒可换成剁椒 1 茶匙，辣度更高，糖可多加半茶匙。"
    ],
    "failures": [
      "茄子吸油成坨：没腌没挤水，或油温太低；腌后挤干，中火煎。",
      "茄子发黑：切开后放置太久氧化；切好立刻撒盐，或泡在淡盐水里。",
      "味道只有酸或只有甜：糖醋比例失衡；按 1:1 调，出锅前尝味再补。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "garlic-broccoli",
    "name": "蒜蓉西兰花",
    "subtitle": "脆嫩清爽的一盘绿",
    "intro": "西兰花掰成小朵，用淡盐水泡出缝隙里的杂质，焯水时加几滴油和一点盐，颜色会更绿。蒜末分两次下锅，一半炒香、一半出锅前拌入，蒜味有层次又不冲。适合搭配大鱼大肉的晚餐，做法清淡快手。",
    "cuisine": "家常菜",
    "tastes": [
      "清淡",
      "蒜香"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 12,
    "cookMinutes": 4,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/garlic-broccoli.png",
      "alt": "蒜蓉西兰花成品示意图：白盘中的深绿色西兰花朵，表面泛着油光与蒜末",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "西兰花",
      "大蒜"
    ],
    "allergenTags": [],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "broccoli",
            "name": "西兰花",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约 1 颗，掰成小朵"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 5,
            "unit": "瓣",
            "scalable": true,
            "note": "一半切末、一半切片"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "约 2 克（焯水与调味各一半）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 15,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "starch",
            "name": "淀粉",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "兑 2 勺水，让蒜末挂住菜"
          },
          {
            "id": "white-pepper",
            "name": "白胡椒粉",
            "amount": null,
            "unit": "克",
            "display": "一小撮",
            "scalable": false
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "西兰花掰成小朵",
        "text": "西兰花倒过来，用刀从粗梗处切下整朵，再顺着小梗掰成均匀的小朵；梗不要扔，削去外层老皮，切成 3 毫米厚的片一起炒。",
        "image": {
          "src": "/images/recipes/garlic-broccoli-step-1.png",
          "alt": "步骤 1 示意图：案板上掰好的西兰花小朵与切成片的菜梗",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 5 分钟"
      },
      {
        "index": 2,
        "title": "淡盐水浸泡冲洗",
        "text": "盆里放一升清水加半勺盐，把西兰花放进去泡 5 分钟，再用手在水里晃动两遍，让缝隙里的灰尘浮出来；捞出沥干水。",
        "image": {
          "src": "/images/recipes/garlic-broccoli-step-2.png",
          "alt": "步骤 2 示意图：盐水中浸泡的西兰花，水面浮着细小杂质",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 6 分钟"
      },
      {
        "index": 3,
        "title": "水开焯烫一分钟",
        "text": "锅里水烧开，加几滴油和一小撮盐，放入西兰花焯 1 分钟，颜色变成深绿立刻捞出，摊在漏勺里沥干，不要过凉水。",
        "image": {
          "src": "/images/recipes/garlic-broccoli-step-3.png",
          "alt": "步骤 3 示意图：沸水中的西兰花颜色转深，旁边放着漏勺",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 4,
        "title": "蒜末分两次爆香",
        "text": "锅烧热倒 15 毫升油，先下一半蒜末，小火炒到边缘微黄、香味出来，立刻转大火，倒入西兰花快速翻炒。",
        "image": {
          "src": "/images/recipes/garlic-broccoli-step-4.png",
          "alt": "步骤 4 示意图：蒜末在油中微微变黄，西兰花正倒入锅中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火转大火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 5,
        "title": "调味勾薄芡出锅",
        "text": "加盐和白胡椒粉翻匀，淋入 2 勺水淀粉，快速翻炒到菜叶表面发亮，关火后拌入剩下的生蒜末，装盘。",
        "image": {
          "src": "/images/recipes/garlic-broccoli-step-5.png",
          "alt": "步骤 5 示意图：锅中西兰花裹上薄芡发亮，生蒜末正拌入",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "焯水时加几滴油，西兰花表面会形成一层薄油膜，颜色更绿。",
      "焯好不要过凉水，直接摊开沥水，炒的时候才不会出水。",
      "蒜末第二次要在关火后拌入，生蒜香才明显，早了会炒糊发苦。"
    ],
    "substitutions": [
      "西兰花可换成芥蓝或菜花，菜花焯水时间延长到 2 分钟。",
      "大蒜可换成蒜苗 2 根，切段在出锅前下锅。",
      "不吃蒜可省略蒜末，改成姜丝 5 克，风味会清淡一些。"
    ],
    "failures": [
      "颜色发黄：焯水时间太长或没加油；水开下锅 1 分钟内捞出。",
      "口感软烂：焯完又回锅久炒；焯水后大火快炒 1 分钟就出锅。",
      "盘底出水：菜没沥干或勾芡太稀；焯后摊开晾，水淀粉按 1:2 调。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "garlic-vermicelli-shrimp",
    "name": "蒜蓉粉丝蒸虾",
    "subtitle": "金银蒜配弹牙大虾",
    "intro": "这道菜的灵魂是蒜蓉：一半蒜末用小火炸到金黄，另一半保持生蒜的辛辣，混在一起既有焦香又不冲。粉丝垫在盘底吸饱虾汁和蒜油，蒸六分钟就够，虾肉紧实弹牙，适合当晚餐的主菜。",
    "cuisine": "粤式",
    "tastes": [
      "蒜香",
      "咸鲜"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 25,
    "cookMinutes": 12,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/garlic-vermicelli-shrimp.png",
      "alt": "蒜蓉粉丝蒸虾成品示意图：圆盘中大虾开背铺满蒜蓉，底下垫着半透明粉丝",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "大虾",
      "龙口粉丝",
      "大蒜",
      "小米辣"
    ],
    "allergenTags": [
      "甲壳类",
      "大豆",
      "贝类"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "prawn",
            "name": "大虾",
            "amount": 10,
            "unit": "只",
            "scalable": true,
            "note": "约 400 克，开背去虾线"
          },
          {
            "id": "vermicelli",
            "name": "龙口粉丝",
            "amount": 1,
            "unit": "把",
            "scalable": true,
            "note": "约 60 克，温水泡软"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 40,
            "unit": "克",
            "scalable": true,
            "note": "约 1 头，剁成末"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 2,
            "unit": "根",
            "scalable": true,
            "note": "切葱花"
          },
          {
            "id": "chili",
            "name": "小米辣",
            "amount": 1,
            "unit": "个",
            "scalable": true,
            "note": "切圈，怕辣可去籽"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "oyster-sauce",
            "name": "蚝油",
            "amount": 10,
            "unit": "克",
            "scalable": true
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 3,
            "unit": "克",
            "scalable": true,
            "note": "提鲜"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 1 克（按口味）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 30,
            "unit": "毫升",
            "scalable": true,
            "note": "一半炸蒜，一半最后泼"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "粉丝泡软虾开背",
        "text": "粉丝用温水泡十五分钟，泡到能用指甲掐断，剪成两段铺在盘底。大虾剪去虾枪和虾须，从背部剪开，挑出虾线。",
        "image": {
          "src": "/images/recipes/garlic-vermicelli-shrimp-step-1.png",
          "alt": "步骤 1 示意图：碗中泡软的粉丝，旁边是剪开背部的大虾和挑出的虾线",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 20 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "炒制金银蒜蓉",
        "text": "蒜剁成末，分成两半。锅中倒一半食用油，小火下其中一半蒜末，慢慢炸到浅金黄立刻关火，连油一起倒进生蒜末里拌匀。",
        "image": {
          "src": "/images/recipes/garlic-vermicelli-shrimp-step-2.png",
          "alt": "步骤 2 示意图：小锅中蒜末在油里炸至浅金黄，旁边碗里是生蒜末",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 4 分钟",
        "heat": "小火"
      },
      {
        "index": 3,
        "title": "铺盘摆虾淋蒜蓉",
        "text": "蒜蓉里加生抽、蚝油、白糖和盐拌匀。把虾背朝上摆在粉丝上，用勺子把蒜蓉填进虾背的开口，剩下的蒜蓉铺在粉丝上。",
        "image": {
          "src": "/images/recipes/garlic-vermicelli-shrimp-step-3.png",
          "alt": "步骤 3 示意图：圆盘中粉丝垫底，开背大虾整齐排列，蒜蓉正被填入虾背",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 4,
        "title": "大火足汽蒸六分",
        "text": "蒸锅水烧开上汽，放入盘子，盖盖大火蒸六分钟。看到虾身变红卷曲、粉丝呈半透明，就可以关火取出。",
        "image": {
          "src": "/images/recipes/garlic-vermicelli-shrimp-step-4.png",
          "alt": "步骤 4 示意图：蒸锅上汽，盘中虾已变红卷曲，粉丝变得半透明",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "大火"
      },
      {
        "index": 5,
        "title": "淋热油激出蒜香",
        "text": "撒上葱花和小米辣圈，另起锅把剩下的油烧到微微冒烟，均匀浇在蒜蓉上激出香味，趁热上桌。",
        "image": {
          "src": "/images/recipes/garlic-vermicelli-shrimp-step-5.png",
          "alt": "步骤 5 示意图：热油浇在蒜蓉和葱花上冒出白烟，虾身油亮",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "大火"
      }
    ],
    "tips": [
      "炸蒜末时油温不能高，下锅后不停搅动，颜色一黄就关火，余温还会加深。",
      "虾背剪得深一点才好装蒜蓉，但别剪断，蒸的时候虾身会自然张开。",
      "粉丝泡到能掐断就够，泡太久蒸完会烂成一坨。"
    ],
    "substitutions": [
      "大虾可换成开背的虾仁或小青龙，蒸制时间相应缩短。",
      "粉丝可换成泡软的粉条或金针菇，吸汁效果同样好。",
      "不吃蚝油可只放生抽，另加 2 克白糖补味。"
    ],
    "failures": [
      "蒜蓉发苦：炸蒜时油温过高或炸过头；浅金黄立刻离火，别等变深黄。",
      "虾肉发柴：蒸的时间超过八分钟；水开上汽后再计时六分钟。",
      "粉丝夹生或糊烂：泡发时间不对；温水十五分钟，能掐断且无硬芯即可。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "green-pepper-pork",
    "name": "青椒肉丝",
    "subtitle": "肉丝滑嫩的快手小炒",
    "intro": "里脊逆纹切丝，用生抽和淀粉抓匀上浆，热锅滑到变色先盛出；青椒大火炒到断生再回锅，肉丝不老、青椒还脆。全程不到十分钟，很适合工作日晚餐配一碗米饭。",
    "cuisine": "家常菜",
    "tastes": [
      "咸鲜",
      "鲜香"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 18,
    "cookMinutes": 4,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/green-pepper-pork.png",
      "alt": "青椒肉丝成品示意图：白盘中青椒丝与肉丝交错，泛着酱色油光",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "猪里脊",
      "青椒",
      "大蒜"
    ],
    "allergenTags": [
      "猪肉",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "pork-tenderloin",
            "name": "猪里脊",
            "amount": 200,
            "unit": "克",
            "scalable": true,
            "note": "逆纹切 3 毫米粗的丝"
          },
          {
            "id": "green-pepper",
            "name": "青椒",
            "amount": 2,
            "unit": "个",
            "scalable": true,
            "note": "去籽切丝"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 3,
            "unit": "瓣",
            "scalable": true,
            "note": "去皮切片"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true,
            "note": "1 茶匙腌肉，1 茶匙调味"
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "腌肉去腥"
          },
          {
            "id": "starch",
            "name": "淀粉",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "上浆，锁住肉汁"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "约 2 克（按口味）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 30,
            "unit": "毫升",
            "scalable": true
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "里脊逆纹切细丝",
        "text": "里脊放冰箱冷冻 20 分钟再切，肉更硬实。顺着纹理找到方向，垂直下刀切成 3 毫米粗的丝，粗细一致受热才均匀。",
        "image": {
          "src": "/images/recipes/green-pepper-pork-step-1.png",
          "alt": "步骤 1 示意图：案板上逆纹切好的肉丝整齐排开，旁边放着刀",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 8 分钟"
      },
      {
        "index": 2,
        "title": "上浆腌制十分钟",
        "text": "肉丝加 1 茶匙生抽、1 茶匙料酒和 1 茶匙淀粉，再分两次加一勺清水，用手抓到发黏，最后淋半勺油封住，腌 10 分钟。",
        "image": {
          "src": "/images/recipes/green-pepper-pork-step-2.png",
          "alt": "步骤 2 示意图：碗中肉丝被手抓拌上浆，表面泛着水光",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 10 分钟"
      },
      {
        "index": 3,
        "title": "青椒去籽切丝",
        "text": "青椒对半切开，用刀背轻轻拍一下，刮掉籽和内侧白筋，再切成和肉丝差不多粗的丝；大蒜去皮切片备用。",
        "image": {
          "src": "/images/recipes/green-pepper-pork-step-3.png",
          "alt": "步骤 3 示意图：案板上青椒剖开去籽，旁边是切好的青椒丝与蒜片",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 4 分钟"
      },
      {
        "index": 4,
        "title": "热锅滑炒肉丝",
        "text": "锅烧到微微冒烟，倒 20 毫升油晃匀，油温五成热时下肉丝，用筷子快速划散，肉丝变白立刻盛出，锅里留底油。",
        "image": {
          "src": "/images/recipes/green-pepper-pork-step-4.png",
          "alt": "步骤 4 示意图：锅中肉丝正被筷子划散，部分已变白",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 5,
        "title": "大火炒青椒断生",
        "text": "补 10 毫升油，下蒜片爆香，倒入青椒丝大火翻炒 1 分钟，炒到颜色变深、边缘略软，撒盐炒匀。",
        "image": {
          "src": "/images/recipes/green-pepper-pork-step-5.png",
          "alt": "步骤 5 示意图：青椒丝在锅中大火翻炒，蒜片散在四周",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 6,
        "title": "回锅合炒调味",
        "text": "把肉丝倒回锅里，加 1 茶匙生抽，大火快速翻炒 30 秒，让酱汁裹匀；尝味后补少许盐，出锅装盘。",
        "image": {
          "src": "/images/recipes/green-pepper-pork-step-6.png",
          "alt": "步骤 6 示意图：肉丝回锅与青椒同炒，酱色均匀裹在食材上",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "肉丝逆纹切、上浆后冷藏，炒出来才嫩；顺纹切会又柴又塞牙。",
      "锅要烧到冒烟再下油，肉丝下锅后先别翻，等底面变白再划散。",
      "青椒炒到断生就回锅，炒久了会发黄出水。"
    ],
    "substitutions": [
      "猪里脊可换成鸡胸肉或牛里脊，鸡肉切丝后上浆时间缩短到 5 分钟。",
      "青椒可换成彩椒或尖椒，尖椒辣度高，盐要少放一点。",
      "不吃大豆可用盐和少许白胡椒粉替代生抽，颜色会偏白。"
    ],
    "failures": [
      "肉丝粘锅成团：锅不够热或油太少；锅冒烟再下油，肉丝分散下锅。",
      "肉丝发柴：炒的时间太长；变色即盛出，回锅只翻 30 秒。",
      "青椒出水发黄：火小或炒得太久；全程大火，断生就回锅。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "ham-cheese-sandwich",
    "name": "火腿芝士三明治",
    "subtitle": "平底锅压出的热三明治",
    "intro": "两片吐司夹火腿和芝士，用平底锅压着煎到两面焦脆、芝士刚好化开，切开时还会拉丝。不需要烤箱和三明治机，十分钟内就能做好一份，适合忙碌的工作日早餐，也适合装进便当盒带走。",
    "cuisine": "西式",
    "tastes": [
      "奶香",
      "咸鲜"
    ],
    "mealTypes": [
      "breakfast"
    ],
    "baseServings": 1,
    "prepMinutes": 5,
    "cookMinutes": 5,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/ham-cheese-sandwich.png",
      "alt": "火腿芝士三明治成品示意图：对角切开的吐司露出火腿、芝士和生菜",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "吐司",
      "火腿片",
      "芝士片",
      "生菜",
      "番茄"
    ],
    "allergenTags": [
      "乳制品",
      "麸质",
      "猪肉"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "toast",
            "name": "吐司",
            "amount": 2,
            "unit": "片",
            "scalable": true,
            "note": "厚切或方包均可"
          },
          {
            "id": "ham",
            "name": "火腿片",
            "amount": 2,
            "unit": "片",
            "scalable": true,
            "note": "约 40 克"
          },
          {
            "id": "cheese",
            "name": "芝士片",
            "amount": 1,
            "unit": "片",
            "scalable": true,
            "note": "切达或马苏里拉"
          },
          {
            "id": "lettuce",
            "name": "生菜",
            "amount": 2,
            "unit": "片",
            "scalable": true,
            "note": "洗净后甩干水"
          },
          {
            "id": "tomato",
            "name": "番茄",
            "amount": 0.5,
            "unit": "个",
            "scalable": true,
            "note": "切薄片，用厨房纸吸干"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "butter",
            "name": "黄油",
            "amount": 10,
            "unit": "克",
            "scalable": true,
            "note": "煎锅用，增香防粘"
          },
          {
            "id": "mayonnaise",
            "name": "蛋黄酱",
            "amount": 1,
            "unit": "勺",
            "scalable": true,
            "note": "涂在吐司内侧，可省略"
          },
          {
            "id": "black-pepper",
            "name": "黑胡椒",
            "amount": null,
            "unit": "克",
            "display": "少许",
            "scalable": false
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "吐司内侧涂薄酱",
        "text": "两片吐司平放，内侧各抹半勺蛋黄酱，边缘留出 1 厘米不涂，免得煎的时候酱汁流到锅里发黑。喜欢清淡的可以只抹黄油。",
        "image": {
          "src": "/images/recipes/ham-cheese-sandwich-step-1.png",
          "alt": "步骤 1 示意图：两片吐司内侧正被抹上薄薄一层蛋黄酱",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 2,
        "title": "夹入火腿与芝士",
        "text": "在第一片吐司上依次铺生菜、火腿片、芝士片和番茄片，番茄片用厨房纸吸过水再放；盖上另一片吐司，用手掌轻轻压平。",
        "image": {
          "src": "/images/recipes/ham-cheese-sandwich-step-2.png",
          "alt": "步骤 2 示意图：吐司上依次叠放生菜、火腿片、芝士片与番茄片",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 3,
        "title": "黄油热锅放三明治",
        "text": "平底锅小火加热，放 10 克黄油化开，晃锅让油铺满锅底；把三明治放进去，用锅铲或小盘子压住，让底面均匀受热。",
        "image": {
          "src": "/images/recipes/ham-cheese-sandwich-step-3.png",
          "alt": "步骤 3 示意图：黄油在平底锅中化开，三明治正被锅铲压住",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 4,
        "title": "压煎两面至焦脆",
        "text": "保持小火压煎 2 分钟，底面呈金黄色后翻面，继续压 1 分半，直到两片吐司都变脆、芝士从边缘微微溢出。",
        "image": {
          "src": "/images/recipes/ham-cheese-sandwich-step-4.png",
          "alt": "步骤 4 示意图：三明治在锅中压煎，芝士从面包边缘微微流出",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 4 分钟"
      },
      {
        "index": 5,
        "title": "对角切开装盘",
        "text": "出锅放在案板上静置 30 秒，让芝士稍微定形，再沿对角线切开；撒一点黑胡椒，配一杯牛奶或黑咖啡。",
        "image": {
          "src": "/images/recipes/ham-cheese-sandwich-step-5.png",
          "alt": "步骤 5 示意图：三明治沿对角线切开，横截面露出火腿与芝士",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "全程小火，黄油焦了吐司还没热；看到黄油起小泡就下三明治。",
      "番茄和生菜一定要吸干水，否则面包吸湿变软，压不出脆壳。",
      "用锅铲压的时候力度均匀，芝士才会贴着火腿化开。"
    ],
    "substitutions": [
      "火腿片可换成煎过的鸡胸肉片，或沥干油的金枪鱼罐头。",
      "芝士片可换成 30 克马苏里拉碎，拉丝效果更好。",
      "不吃猪肉可换成火鸡胸片，注意查看包装配料表。"
    ],
    "failures": [
      "面包焦了芝士还没化：火太大；改小火，盖上锅盖焖 30 秒。",
      "三明治散开：夹的馅太多或没压紧；控制在两片火腿、一片芝士，组装后压平。",
      "底部湿软：生菜和番茄没擦干；洗净甩水后，再用厨房纸吸一遍。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "hand-torn-cabbage",
    "name": "手撕包菜",
    "subtitle": "手撕更入味的大火快炒",
    "intro": "包菜用手撕比刀切更入味，粗糙的断面更容易挂住酱汁。全程大火快炒，蒜片和干辣椒先爆香，出锅前沿着锅边淋一勺香醋，脆、香、带一点辣。配米饭或面条都合适，十几分钟就能上桌。",
    "cuisine": "家常菜",
    "tastes": [
      "蒜香",
      "香辣"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 8,
    "cookMinutes": 6,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/hand-torn-cabbage.png",
      "alt": "手撕包菜成品示意图：白盘中翠绿菜叶与红色干辣椒段，蒜片点缀",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "包菜",
      "大蒜",
      "干辣椒"
    ],
    "allergenTags": [
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "cabbage",
            "name": "包菜",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约半颗，手撕成大片"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 4,
            "unit": "瓣",
            "scalable": true,
            "note": "切片"
          },
          {
            "id": "dried-chili",
            "name": "干辣椒",
            "amount": 5,
            "unit": "个",
            "scalable": true,
            "note": "剪段，怕辣可不剪开"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 15,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "black-vinegar",
            "name": "香醋",
            "amount": 10,
            "unit": "毫升",
            "scalable": true,
            "note": "出锅前沿锅边淋入"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 2 克（按口味调整）",
            "scalable": false
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 3,
            "unit": "克",
            "scalable": true,
            "note": "提鲜，吃不出甜味"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "手撕包菜洗净沥干",
        "text": "包菜从根部整颗掰开，去掉硬芯，用手顺着纹理撕成巴掌大的片。撕好的菜叶放进清水里淘洗两遍，捞出沥干，水越干炒出来越脆。",
        "image": {
          "src": "/images/recipes/hand-torn-cabbage-step-1.png",
          "alt": "步骤 1 示意图：双手撕开包菜叶，沥水篮中堆着撕好的菜片",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "爆香蒜片干辣椒",
        "text": "蒜去皮切片，干辣椒剪成两段并抖掉部分辣椒籽。锅烧到微微冒烟再倒油，下蒜片和干辣椒，小火爆到蒜片边缘发黄、闻到香味。",
        "image": {
          "src": "/images/recipes/hand-torn-cabbage-step-2.png",
          "alt": "步骤 2 示意图：炒锅中蒜片与干辣椒段在油里冒小泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 1 分钟",
        "heat": "小火"
      },
      {
        "index": 3,
        "title": "大火快炒至断生",
        "text": "转大火，把沥干的包菜全部倒入锅中，用铲子快速翻炒，让每片叶子都沾上油。炒到菜叶边缘变透明、体积明显缩小，大约两分钟。",
        "image": {
          "src": "/images/recipes/hand-torn-cabbage-step-3.png",
          "alt": "步骤 3 示意图：大火中包菜在锅里翻动，菜叶边缘变得透亮",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "大火"
      },
      {
        "index": 4,
        "title": "沿锅边淋醋调味",
        "text": "沿锅边淋入生抽，撒盐和白糖，继续翻炒十几下。最后把香醋沿着锅边一圈淋入，快速翻两下立刻关火装盘，醋香会留在菜叶上。",
        "image": {
          "src": "/images/recipes/hand-torn-cabbage-step-4.png",
          "alt": "步骤 4 示意图：锅边冒着醋香白气，包菜叶上挂着油亮的酱汁",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 1 分钟",
        "heat": "大火"
      }
    ],
    "tips": [
      "包菜洗完一定要沥干，带水下锅就变成水煮，炒不出脆感。",
      "香醋最后沿锅边淋，遇热瞬间挥发才香，早放只会发酸。",
      "全程保持在两到三分钟之内，锅要烧到冒烟再下菜。"
    ],
    "substitutions": [
      "没有干辣椒可用 1 茶匙辣椒面，在淋醋前撒入锅中。",
      "包菜可换成同等重量的紫甘蓝，炒制时间略短一些。",
      "不吃蒜可省略蒜片，改用两片姜爆锅。"
    ],
    "failures": [
      "出水塌软：火不够大或菜没沥干；锅烧到冒烟再下菜，全程不超过三分钟。",
      "味道发苦：蒜片和干辣椒爆过头焦糊；小火爆香，蒜片刚变黄就下菜。",
      "咸味不均：生抽直接浇在菜上容易局部过咸；沿锅边淋，再用铲子翻匀。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "kung-pao-chicken",
    "name": "宫保鸡丁",
    "subtitle": "酸甜微辣的经典川味",
    "intro": "鸡腿肉切丁上浆，干辣椒和花椒小火焙出香味，倒入糖醋调成的宫保汁，最后放一把酥花生。鸡肉滑嫩、花生脆香，汁水收得亮而不腻，是餐桌上很讨喜的一道菜，配米饭尤其合适。",
    "cuisine": "川湘",
    "tastes": [
      "香辣",
      "酸甜"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 20,
    "cookMinutes": 7,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/kung-pao-chicken.png",
      "alt": "宫保鸡丁成品示意图：白盘中鸡丁裹着亮红酱汁，间杂花生米与干辣椒段",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "鸡腿肉",
      "花生米",
      "干辣椒",
      "大葱"
    ],
    "allergenTags": [
      "花生",
      "鸡肉",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "chicken-thigh",
            "name": "鸡腿肉",
            "amount": 300,
            "unit": "克",
            "scalable": true,
            "note": "去骨切 1.5 厘米见方的丁"
          },
          {
            "id": "peanuts",
            "name": "花生米",
            "amount": 50,
            "unit": "克",
            "scalable": true,
            "note": "生花生，冷油酥"
          },
          {
            "id": "dried-chili",
            "name": "干辣椒",
            "amount": 8,
            "unit": "个",
            "scalable": true,
            "note": "剪段去籽"
          },
          {
            "id": "scallion",
            "name": "大葱",
            "amount": 1,
            "unit": "根",
            "scalable": true,
            "note": "切 1 厘米长的段"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true,
            "note": "1 茶匙腌鸡丁，1 茶匙调汁"
          },
          {
            "id": "black-vinegar",
            "name": "香醋",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "starch",
            "name": "淀粉",
            "amount": 2,
            "unit": "茶匙",
            "scalable": true,
            "note": "1 茶匙上浆，1 茶匙调汁"
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "sichuan-pepper",
            "name": "花椒",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 1,
            "unit": "块",
            "scalable": true,
            "note": "切末"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 3,
            "unit": "瓣",
            "scalable": true,
            "note": "切末"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "约 1 克",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 60,
            "unit": "毫升",
            "scalable": true
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "鸡腿去骨切丁",
        "text": "鸡腿肉皮朝下放在案板上，用刀尖沿着骨头划开，剔出整块肉，再切成 1.5 厘米见方的丁；鸡皮可以去掉，也可以留着增香。",
        "image": {
          "src": "/images/recipes/kung-pao-chicken-step-1.png",
          "alt": "步骤 1 示意图：案板上剔下的鸡腿肉与切成方丁的鸡肉",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 8 分钟"
      },
      {
        "index": 2,
        "title": "鸡丁上浆腌十分钟",
        "text": "鸡丁加 1 茶匙生抽、1 茶匙料酒、1 茶匙淀粉和一小撮盐，抓匀后加半勺清水再抓，最后淋一点油，腌 10 分钟。",
        "image": {
          "src": "/images/recipes/kung-pao-chicken-step-2.png",
          "alt": "步骤 2 示意图：碗中鸡丁上浆，旁边放着生抽与淀粉小碟",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 10 分钟"
      },
      {
        "index": 3,
        "title": "提前兑好宫保汁",
        "text": "取一只小碗，先放 2 茶匙白糖和 2 茶匙香醋搅到糖化，再加 2 茶匙生抽、1 茶匙淀粉和 3 勺清水，调匀备用。",
        "image": {
          "src": "/images/recipes/kung-pao-chicken-step-3.png",
          "alt": "步骤 3 示意图：小碗中酱汁被筷子搅动，碗边摆着糖与醋",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 4,
        "title": "冷油酥花生米",
        "text": "锅里放 30 毫升油，冷油下花生米，开小火慢慢加热，用铲子不停翻动，听到噼啪声、花生皮微微开裂就捞出，摊在盘里晾凉。",
        "image": {
          "src": "/images/recipes/kung-pao-chicken-step-4.png",
          "alt": "步骤 4 示意图：冷油锅中花生米冒小泡，铲子正在翻动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 4 分钟"
      },
      {
        "index": 5,
        "title": "焙香辣椒炒鸡丁",
        "text": "锅里留 30 毫升油，小火下干辣椒段和花椒，炒到辣椒变暗红、香味出来，转大火下鸡丁，摊平煎 20 秒再翻炒至变色。",
        "image": {
          "src": "/images/recipes/kung-pao-chicken-step-5.png",
          "alt": "步骤 5 示意图：锅中干辣椒与花椒焙出香味，鸡丁正下锅",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火转大火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 6,
        "title": "烹汁收稠下花生",
        "text": "倒入葱段和姜蒜末炒香，把宫保汁再搅一下沿锅边淋入，大火翻炒到汁水变亮、裹住鸡丁，关火后倒入花生米翻两下。",
        "image": {
          "src": "/images/recipes/kung-pao-chicken-step-6.png",
          "alt": "步骤 6 示意图：酱汁在锅中收亮裹住鸡丁，花生米刚撒入",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "花生米冷油下锅、小火慢炸，出锅后还会继续变深，颜色浅一点就要捞。",
      "宫保汁下锅前一定再搅一次，淀粉沉底会让汁结块。",
      "干辣椒只用小火焙，油温高了立刻发黑发苦，整锅都会带苦味。"
    ],
    "substitutions": [
      "鸡腿肉可换成鸡胸肉，上浆时多加半茶匙淀粉，炒的时间缩短 30 秒。",
      "花生米可换成腰果或炸过的黄豆，坚果过敏者请省略。",
      "香醋可换成陈醋，酸味更重，糖可以加到 2.5 茶匙平衡。"
    ],
    "failures": [
      "鸡丁发柴：炒太久或没上浆；变色后立刻倒汁，全程不超过 2 分钟。",
      "汁太稀裹不住：淀粉放少了或没搅匀；1 茶匙淀粉配 3 勺水，下锅前再搅。",
      "整体发苦：辣椒或花椒炒糊；小火焙香，颜色一变深就下鸡丁。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "mapo-tofu",
    "name": "麻婆豆腐",
    "subtitle": "一勺红油拌两碗饭",
    "intro": "嫩豆腐先用淡盐水焯一下，去豆味也不容易碎；肉末炒散后加豆瓣酱炒出红油，再下豆腐小火煨几分钟，分两次勾芡让汤汁挂在豆腐上。出锅前撒花椒粉和蒜苗，麻辣鲜香，做起来比想象中简单。",
    "cuisine": "川湘",
    "tastes": [
      "香辣",
      "咸鲜"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 8,
    "cookMinutes": 11,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/mapo-tofu.png",
      "alt": "麻婆豆腐成品示意图：红亮汤汁中的豆腐块，表面撒有花椒粉与蒜苗",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "嫩豆腐",
      "猪肉末",
      "蒜苗"
    ],
    "allergenTags": [
      "大豆",
      "猪肉"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "silken-tofu",
            "name": "嫩豆腐",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "切 2 厘米见方的块"
          },
          {
            "id": "minced-pork",
            "name": "猪肉末",
            "amount": 100,
            "unit": "克",
            "scalable": true,
            "note": "肥瘦三七"
          },
          {
            "id": "garlic-sprout",
            "name": "蒜苗",
            "amount": 2,
            "unit": "根",
            "scalable": true,
            "note": "斜切段，蒜白蒜叶分开"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "doubanjiang",
            "name": "郫县豆瓣酱",
            "amount": 1,
            "unit": "勺",
            "scalable": true,
            "note": "剁细"
          },
          {
            "id": "sichuan-pepper-powder",
            "name": "花椒粉",
            "amount": null,
            "unit": "克",
            "display": "约 1 克（按口味）",
            "scalable": false
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true
          },
          {
            "id": "starch",
            "name": "淀粉",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "兑 3 勺水成水淀粉"
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 0.5,
            "unit": "茶匙",
            "scalable": true,
            "note": "中和豆瓣酱的咸"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 1,
            "unit": "块",
            "scalable": true,
            "note": "切末"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 2,
            "unit": "瓣",
            "scalable": true,
            "note": "切末"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "少许（焯豆腐用）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 30,
            "unit": "毫升",
            "scalable": true
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "豆腐切块盐水焯",
        "text": "豆腐切成 2 厘米见方的块，锅中水烧开加一小撮盐，下豆腐小火焯 1 分钟，捞出沥水；盐水能让豆腐更紧实，炒的时候不易碎。",
        "image": {
          "src": "/images/recipes/mapo-tofu-step-1.png",
          "alt": "步骤 1 示意图：豆腐块在淡盐水中微微翻动，漏勺靠在锅边",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 2,
        "title": "姜蒜切末调水淀粉",
        "text": "姜蒜去皮切成细末，蒜苗斜切成段，蒜白和蒜叶分开放；1 茶匙淀粉加 3 勺清水搅匀，等会儿要分两次用。",
        "image": {
          "src": "/images/recipes/mapo-tofu-step-2.png",
          "alt": "步骤 2 示意图：案板上姜蒜末与蒜苗段，小碗中水淀粉静置",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 3,
        "title": "炒肉末出油下豆瓣",
        "text": "锅烧热放 30 毫升油，下猪肉末中火炒散，炒到肉末发白、边缘微焦，拨到一边，下豆瓣酱和姜蒜末炒出红油。",
        "image": {
          "src": "/images/recipes/mapo-tofu-step-3.png",
          "alt": "步骤 3 示意图：锅中肉末被拨到一侧，豆瓣酱在油中炒出红色",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 4,
        "title": "下豆腐小火慢煨",
        "text": "加入 200 毫升热水和 1 茶匙生抽、半茶匙白糖，汤开后轻轻推入豆腐，转小火煨 3 分钟，期间用铲背推锅底，不要翻搅。",
        "image": {
          "src": "/images/recipes/mapo-tofu-step-4.png",
          "alt": "步骤 4 示意图：红汤中豆腐块微微颤动，铲背贴着锅底推动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 4 分钟"
      },
      {
        "index": 5,
        "title": "分两次勾芡收汁",
        "text": "转中火，淋一半水淀粉，等汤汁变稠再淋剩下的一半，用铲背推匀；撒蒜苗段和花椒粉，出锅装盘。",
        "image": {
          "src": "/images/recipes/mapo-tofu-step-5.png",
          "alt": "步骤 5 示意图：汤汁收浓裹住豆腐，蒜苗段与花椒粉正撒入锅中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中火",
        "timeHint": "约 2 分钟"
      }
    ],
    "tips": [
      "豆腐焯水时水要开、火要小，水滚得太厉害会把豆腐冲散。",
      "豆瓣酱一定要炒出红油再下豆腐，颜色和香味都靠这一步。",
      "勾芡分两次，第一次让汤汁变稠，第二次才能挂住豆腐表面。"
    ],
    "substitutions": [
      "猪肉末可换成牛肉末，风味更浓；素食版本可省略肉末，多加 1 茶匙豆瓣酱。",
      "嫩豆腐可换成内酯豆腐，口感更滑，焯水时间缩短到 30 秒。",
      "不吃辣可把豆瓣酱减到半勺，花椒粉换成熟白芝麻。"
    ],
    "failures": [
      "豆腐碎成渣：下锅后翻炒或水滚太大；用铲背推，保持小火。",
      "只有咸味没有香味：豆瓣酱没炒出红油；中火炒到油色发红再下豆腐。",
      "汤汁澥掉：只勾了一次芡或水淀粉太稀；分两次勾，淀粉与水按 1:3 调。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "millet-pumpkin-porridge",
    "name": "小米南瓜粥",
    "subtitle": "南瓜自然甜的绵软早餐",
    "intro": "小米淘洗后先泡一会儿，再和南瓜一起小火慢熬，粥体浓稠、入口带一点南瓜的自然甜味。做法不挑锅具，电饭煲或普通煮锅都能完成，适合周末早晨一次煮两碗，配一碟小咸菜就是很舒服的一顿早餐。",
    "cuisine": "家常菜",
    "tastes": [
      "清淡",
      "微甜"
    ],
    "mealTypes": [
      "breakfast"
    ],
    "baseServings": 2,
    "prepMinutes": 15,
    "cookMinutes": 40,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/millet-pumpkin-porridge.png",
      "alt": "小米南瓜粥成品示意图：浅金黄色粥盛在碗中，表面浮着南瓜块",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "小米",
      "南瓜"
    ],
    "allergenTags": [],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "millet",
            "name": "小米",
            "amount": 80,
            "unit": "克",
            "scalable": true,
            "note": "约半碗，淘洗后浸泡"
          },
          {
            "id": "pumpkin",
            "name": "南瓜",
            "amount": 250,
            "unit": "克",
            "scalable": true,
            "note": "去皮去瓤，切 2 厘米小块"
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 900,
            "unit": "毫升",
            "scalable": true,
            "note": "煮粥用，中途可补热水"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "rock-sugar",
            "name": "冰糖",
            "amount": 10,
            "unit": "克",
            "scalable": true,
            "note": "南瓜较甜时可减到 5 克"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "一小撮（可选，约 1 克）",
            "scalable": false,
            "note": "提一点底味，不加也可以"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "小米淘洗后浸泡",
        "text": "小米倒进碗里，加清水没过，用手指轻轻搅动淘洗两遍，倒掉浑水；再换清水浸泡 10 分钟，煮的时候更容易出米油。",
        "image": {
          "src": "/images/recipes/millet-pumpkin-porridge-step-1.png",
          "alt": "步骤 1 示意图：碗中清水里的小米正被手指轻轻搅动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 10 分钟"
      },
      {
        "index": 2,
        "title": "南瓜去皮切小块",
        "text": "南瓜对半切开，用勺子刮掉瓜瓤和籽，削去外皮，切成 2 厘米见方的小块。块切得大小一致，煮的时候熟度才均匀。",
        "image": {
          "src": "/images/recipes/millet-pumpkin-porridge-step-2.png",
          "alt": "步骤 2 示意图：案板上摆着去皮的南瓜与切好的南瓜块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 5 分钟"
      },
      {
        "index": 3,
        "title": "水开后再下小米",
        "text": "锅中倒入 900 毫升清水，大火烧到锅底冒密集小泡、水面明显翻动，再倒入沥干的小米，用勺子搅两圈，防止米粒沉底粘锅。",
        "image": {
          "src": "/images/recipes/millet-pumpkin-porridge-step-3.png",
          "alt": "步骤 3 示意图：沸水中倒入小米，勺子正沿锅底搅动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 5 分钟"
      },
      {
        "index": 4,
        "title": "转小火慢熬出米油",
        "text": "水再次沸腾后转小火，锅盖留一条缝，每隔 5 分钟用勺子沿锅底推搅一次；熬到米粒开花、汤汁明显变稠，大约 20 分钟。",
        "image": {
          "src": "/images/recipes/millet-pumpkin-porridge-step-4.png",
          "alt": "步骤 4 示意图：盖着留缝锅盖的小锅，锅内粥面微微冒泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 20 分钟"
      },
      {
        "index": 5,
        "title": "下南瓜煮至软糯",
        "text": "把南瓜块放进锅里推匀，保持小火再煨 10 分钟，直到南瓜用勺子一压就碎、粥色变成浅金黄。中途太稠就补少量热水。",
        "image": {
          "src": "/images/recipes/millet-pumpkin-porridge-step-5.png",
          "alt": "步骤 5 示意图：南瓜块在粥中煮软，勺子正按压南瓜",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 10 分钟"
      },
      {
        "index": 6,
        "title": "调甜味再焖一会儿",
        "text": "按口味放入冰糖，搅到完全化开，尝一下甜度；关火后盖盖焖 5 分钟，表面会结出一层细腻的米油，再盛碗。",
        "image": {
          "src": "/images/recipes/millet-pumpkin-porridge-step-6.png",
          "alt": "步骤 6 示意图：冰糖落入粥中，碗边放着盛粥的勺子",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 5 分钟"
      }
    ],
    "tips": [
      "小米淘洗两遍就够，反复搓洗会把表层的米油洗掉，粥不容易浓。",
      "水开再下米，米粒不容易粘锅底；如果冷水下米，前 5 分钟要一直搅动。",
      "南瓜分两次放：一半先煮化进粥里增稠，一半后放保留块状口感。"
    ],
    "substitutions": [
      "没有小米可用等量小米面或玉米糁替代，煮的时间缩短到 20 分钟左右。",
      "冰糖可以换成 2 颗红枣或半根切段的红薯，甜味更自然。",
      "南瓜可用等重量的贝贝南瓜或老南瓜，老南瓜水分少，清水可多加 100 毫升。"
    ],
    "failures": [
      "粥有生米味：小米没泡透或全程大火，外层糊了里面还硬；淘洗后泡 10 分钟，水开后立刻转小火。",
      "糊底：下米后没有搅动，或锅底太薄受热不均；前 10 分钟每 3 分钟沿锅底推一次。",
      "稠得像米饭：水放少了或煮过头；补热水调到能流动的稠度，不要直接加冷水。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "oat-milk-porridge",
    "name": "燕麦牛奶粥",
    "subtitle": "五分钟出锅的奶香早餐",
    "intro": "即食燕麦片加牛奶，小火煮到锅边微微冒泡就关火，前后不到五分钟。燕麦吸饱牛奶后软糯，表面铺几片香蕉、淋一点蜂蜜，甜度刚好。适合工作日起晚了又想吃口热的早晨，一个奶锅就能搞定。",
    "cuisine": "轻食",
    "tastes": [
      "奶香",
      "微甜"
    ],
    "mealTypes": [
      "breakfast"
    ],
    "baseServings": 1,
    "prepMinutes": 2,
    "cookMinutes": 4,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/oat-milk-porridge.png",
      "alt": "燕麦牛奶粥成品示意图：奶白色粥盛在碗中，表面铺着香蕉片",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "即食燕麦片",
      "牛奶",
      "香蕉"
    ],
    "allergenTags": [
      "乳制品",
      "麸质"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "instant-oats",
            "name": "即食燕麦片",
            "amount": 40,
            "unit": "克",
            "scalable": true,
            "note": "不要用需要久煮的钢切燕麦"
          },
          {
            "id": "milk",
            "name": "牛奶",
            "amount": 200,
            "unit": "毫升",
            "scalable": true,
            "note": "全脂更香，可用无乳糖牛奶代替"
          },
          {
            "id": "banana",
            "name": "香蕉",
            "amount": 0.5,
            "unit": "根",
            "scalable": true,
            "note": "切薄片，留几片铺面"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "honey",
            "name": "蜂蜜",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "按香蕉甜度增减"
          },
          {
            "id": "cinnamon",
            "name": "肉桂粉",
            "amount": null,
            "unit": "克",
            "display": "一小撮（可省略）",
            "scalable": false
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "指尖一小撮",
            "scalable": false,
            "note": "提奶香，可省略"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "量好燕麦与牛奶",
        "text": "碗里倒入 40 克即食燕麦片，加 200 毫升牛奶，用勺子搅一下，让每片燕麦都沾到牛奶，静置 1 分钟吸水。",
        "image": {
          "src": "/images/recipes/oat-milk-porridge-step-1.png",
          "alt": "步骤 1 示意图：碗中燕麦片被牛奶浸没，旁边放着量勺",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 2,
        "title": "香蕉切片、备好蜂蜜",
        "text": "香蕉剥皮，先切 4 到 5 片薄片留着铺面，剩下的切成小丁；蜂蜜量好放在小碟里，免得煮的时候手忙脚乱。",
        "image": {
          "src": "/images/recipes/oat-milk-porridge-step-2.png",
          "alt": "步骤 2 示意图：案板上切好的香蕉片与一小碟蜂蜜",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 3,
        "title": "小火加热不停搅拌",
        "text": "把燕麦牛奶倒进小奶锅，开小火，用硅胶铲贴着锅底不停画圈。锅边刚冒小泡、粥体开始变稠时立刻调最小火，不要煮到翻滚。",
        "image": {
          "src": "/images/recipes/oat-milk-porridge-step-3.png",
          "alt": "步骤 3 示意图：小奶锅中燕麦粥微沸，硅胶铲正在搅动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 4,
        "title": "关火拌入蜂蜜",
        "text": "关火后等 20 秒再放蜂蜜，太烫会盖住奶香；搅匀后尝一口，香蕉本身够甜的话蜂蜜可以只放半茶匙。",
        "image": {
          "src": "/images/recipes/oat-milk-porridge-step-4.png",
          "alt": "步骤 4 示意图：蜂蜜淋入锅中燕麦粥，铲子准备搅拌",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 5,
        "title": "盛碗后铺上香蕉片",
        "text": "把粥盛进碗里，静置 30 秒让它再稠一点，表面铺香蕉片，撒一小撮肉桂粉。喜欢稀的可以补 30 毫升温牛奶调开。",
        "image": {
          "src": "/images/recipes/oat-milk-porridge-step-5.png",
          "alt": "步骤 5 示意图：盛好的燕麦粥表面摆着香蕉片并撒了肉桂粉",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "牛奶不要煮沸，锅边冒小泡就关火，煮滚后容易起奶皮、糊底。",
      "用即食燕麦片，下锅 2 分钟就能软；钢切燕麦需要提前浸泡 20 分钟。",
      "想让粥更稠，关火后静置半分钟，燕麦会继续吸水。"
    ],
    "substitutions": [
      "牛奶可换成无糖豆奶或燕麦奶，奶香会淡一些，可多加半茶匙蜂蜜。",
      "香蕉可以换成 6 颗对半切的草莓或半小把蓝莓，酸味重的补一点蜂蜜。",
      "蜂蜜可换成 1 茶匙枫糖浆，风味更清淡。"
    ],
    "failures": [
      "糊底：火太大或没有搅拌；全程小火并贴着锅底画圈，一冒泡就调小。",
      "太稀或太干：燕麦与牛奶比例不对，40 克燕麦配 200 毫升牛奶是基准，喜欢稠的减 20 毫升牛奶。",
      "起奶皮、有腥味：加热时间过长；关火后不要盖严，趁热喝。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "oyster-sauce-lettuce",
    "name": "蚝油生菜",
    "subtitle": "三十秒焯水，脆嫩不出水",
    "intro": "生菜最怕炒久，一软就出水。改成先焯后浇汁：沸水里加盐和几滴油，生菜烫二十秒立刻捞出，保持翠绿脆嫩；再浇上用蚝油和蒜末勾好的薄芡。十分钟就能端上桌，很适合当晚餐的配菜。",
    "cuisine": "粤式",
    "tastes": [
      "咸鲜",
      "蒜香"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 10,
    "cookMinutes": 5,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/oyster-sauce-lettuce.png",
      "alt": "蚝油生菜成品示意图：白盘中翠绿生菜叶上淋着褐色蚝油芡汁与蒜末",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "生菜",
      "大蒜"
    ],
    "allergenTags": [
      "贝类",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "lettuce",
            "name": "生菜",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约 1 颗，掰片洗净"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 3,
            "unit": "瓣",
            "scalable": true,
            "note": "切末"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "oyster-sauce",
            "name": "蚝油",
            "amount": 20,
            "unit": "克",
            "scalable": true,
            "note": "调味主体"
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 10,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 3,
            "unit": "克",
            "scalable": true,
            "note": "平衡咸味"
          },
          {
            "id": "cornstarch",
            "name": "玉米淀粉",
            "amount": 5,
            "unit": "克",
            "scalable": true,
            "note": "加水调成芡汁"
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 60,
            "unit": "毫升",
            "scalable": true,
            "note": "调芡汁用"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 15,
            "unit": "毫升",
            "scalable": true,
            "note": "炒蒜末用"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 1 克（焯水用）",
            "scalable": false
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "生菜掰片泡洗",
        "text": "生菜一片片掰开，切掉根部发硬的部分，用淡盐水泡五分钟，再冲洗两遍。捞出后竖着控干，叶缝里的水要甩干净。",
        "image": {
          "src": "/images/recipes/oyster-sauce-lettuce-step-1.png",
          "alt": "步骤 1 示意图：盆中淡盐水泡着生菜叶，旁边是沥水篮",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 10 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "沸水焯烫三十秒",
        "text": "锅中烧大半锅水，水开后加盐和几滴食用油。把生菜分批下锅，烫二十到三十秒，叶子刚变软就立刻捞出，铺在盘中。",
        "image": {
          "src": "/images/recipes/oyster-sauce-lettuce-step-2.png",
          "alt": "步骤 2 示意图：沸水中生菜叶变软发亮，漏勺正准备捞出",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 3 分钟",
        "heat": "大火"
      },
      {
        "index": 3,
        "title": "小火炒香蒜蓉",
        "text": "蒜切末。小碗里放蚝油、生抽、白糖、玉米淀粉和清水，搅匀成碗汁。锅中倒油，小火爆香蒜末后倒入碗汁。",
        "image": {
          "src": "/images/recipes/oyster-sauce-lettuce-step-3.png",
          "alt": "步骤 3 示意图：小碗中调好的蚝油汁，旁边锅中蒜末在油里冒泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "小火"
      },
      {
        "index": 4,
        "title": "勾芡浇汁上桌",
        "text": "边加热边搅动，汁一变透明浓稠立刻关火，趁热均匀浇在生菜上。这道菜要马上吃，放久了菜叶会出水、变黄。",
        "image": {
          "src": "/images/recipes/oyster-sauce-lettuce-step-4.png",
          "alt": "步骤 4 示意图：浓稠的蚝油芡汁正被浇在盘中翠绿的生菜上",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 1 分钟",
        "heat": "关火"
      }
    ],
    "tips": [
      "焯水时加油能在菜叶表面挂一层油膜，颜色更绿，也不易出水。",
      "生菜焯水宁短勿长，二十秒就够，捞出后余温还会继续加热。",
      "芡汁要薄，能流动又挂得住菜叶，太稠会糊成一团。"
    ],
    "substitutions": [
      "生菜可换成油麦菜、菜心或芥蓝，芥蓝需先焯一分钟。",
      "不吃蚝油可用生抽加 2 克白糖代替，风味会少一点海味。",
      "蒜末可用 1 茶匙蒜粉替代，香气略淡。"
    ],
    "failures": [
      "生菜发黄发软：焯水时间过长或水没开就下菜；水大滚、二十秒即捞。",
      "盘底一汪水：菜没控干或芡汁太稀；焯后控水，淀粉与水约一比十二。",
      "酱汁发苦：蒜末炒焦；小火炒到出香即可，不要等变黄。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "pan-seared-salmon",
    "name": "香煎三文鱼",
    "subtitle": "外皮焦脆，内里粉嫩",
    "intro": "三文鱼本身油脂丰富，煎的时候不需要太多油。鱼皮朝下先用中大火定型，翻面后用黄油把香气淋上去，出锅静置两分钟再切，中心刚好粉嫩。配柠檬角和煎芦笋，就是一顿不费力的晚餐。",
    "cuisine": "西式",
    "tastes": [
      "清淡",
      "鲜香"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 10,
    "cookMinutes": 10,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/pan-seared-salmon.png",
      "alt": "香煎三文鱼成品示意图：白盘中鱼排皮面金黄，旁配芦笋和柠檬角",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "三文鱼排",
      "柠檬",
      "芦笋",
      "大蒜"
    ],
    "allergenTags": [
      "鱼",
      "乳制品"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "salmon",
            "name": "三文鱼排",
            "amount": 2,
            "unit": "块",
            "scalable": true,
            "note": "带皮，每块约 150 克"
          },
          {
            "id": "lemon",
            "name": "柠檬",
            "amount": 0.5,
            "unit": "个",
            "scalable": true,
            "note": "切角，吃前挤汁"
          },
          {
            "id": "asparagus",
            "name": "芦笋",
            "amount": 150,
            "unit": "克",
            "scalable": true,
            "note": "去掉老根"
          },
          {
            "id": "garlic",
            "name": "大蒜",
            "amount": 2,
            "unit": "瓣",
            "scalable": true,
            "note": "拍扁，不必切碎"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "butter",
            "name": "黄油",
            "amount": 15,
            "unit": "克",
            "scalable": true,
            "note": "可换成等量橄榄油"
          },
          {
            "id": "olive-oil",
            "name": "橄榄油",
            "amount": 10,
            "unit": "毫升",
            "scalable": true,
            "note": "煎鱼用"
          },
          {
            "id": "sea-salt",
            "name": "海盐",
            "amount": null,
            "unit": "",
            "display": "约 2 克（按口味）",
            "scalable": false
          },
          {
            "id": "black-pepper",
            "name": "黑胡椒",
            "amount": null,
            "unit": "",
            "display": "少许",
            "scalable": false
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "鱼排回温擦干水",
        "text": "三文鱼从冰箱取出回温十五分钟，用厨房纸把两面和鱼皮彻底吸干。两面撒海盐和黑胡椒，静置五分钟入味。",
        "image": {
          "src": "/images/recipes/pan-seared-salmon-step-1.png",
          "alt": "步骤 1 示意图：厨房纸上放着两块三文鱼排，表面已撒上盐和黑胡椒",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 15 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "皮朝下煎至酥脆",
        "text": "平底锅大火烧热，倒橄榄油，鱼皮朝下放入，用铲子轻压三十秒让鱼皮贴紧锅底。转中大火煎四分钟，期间不要翻动。",
        "image": {
          "src": "/images/recipes/pan-seared-salmon-step-2.png",
          "alt": "步骤 2 示意图：平底锅中鱼皮朝下煎，铲子压住鱼排，锅边有油烟",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "中大火"
      },
      {
        "index": 3,
        "title": "翻面黄油淋香",
        "text": "翻面后转中火，放入黄油和拍扁的蒜瓣。黄油融化后用勺子反复把油淋在鱼身上，煎两分钟至中心刚变色。",
        "image": {
          "src": "/images/recipes/pan-seared-salmon-step-3.png",
          "alt": "步骤 3 示意图：黄油在锅中融化起泡，勺子正把黄油淋在鱼排上",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "中火"
      },
      {
        "index": 4,
        "title": "静置挤柠檬汁",
        "text": "鱼排出锅静置两分钟，让肉汁回流。芦笋用锅里剩下的黄油煎一分钟，和柠檬角一起摆盘，吃前挤上柠檬汁。",
        "image": {
          "src": "/images/recipes/pan-seared-salmon-step-4.png",
          "alt": "步骤 4 示意图：盘中鱼排旁摆着煎好的芦笋和柠檬角，热气升腾",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 3 分钟",
        "heat": "中火"
      }
    ],
    "tips": [
      "鱼皮必须擦干、锅要够热，下锅后压住三十秒，皮才会平整酥脆。",
      "煎鱼只翻一次面，反复翻动鱼肉容易散。",
      "中心刚变粉白就出锅，静置两分钟余温会让它继续熟成。"
    ],
    "substitutions": [
      "黄油可换成橄榄油，风味更清爽，也适合乳糖不耐的人。",
      "三文鱼可换成银鳕鱼或鲈鱼排，煎制时间按厚度调整。",
      "芦笋可换成小番茄或口蘑，同样用锅里的余油煎熟。"
    ],
    "failures": [
      "鱼皮粘锅：锅不够热或鱼皮有水；锅冒烟再下鱼，下锅后别急着动。",
      "鱼肉发干：煎过头或火太大；中大火每面四分钟以内，出锅静置。",
      "黄油焦糊：黄油下得太早；翻面后再放，融化后立刻转小火。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "potato-rib-stew",
    "name": "土豆炖排骨",
    "subtitle": "排骨软烂，土豆吸饱汤汁",
    "intro": "排骨先煸后炖，肉香更足；土豆后放，既不会煮化，又能吸满酱汁。这道菜火候不急，炖足五十分钟，排骨轻轻一咬就脱骨，土豆边缘起沙，剩下的汤汁拌米饭特别香。",
    "cuisine": "北方",
    "tastes": [
      "酱香",
      "咸鲜"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 3,
    "prepMinutes": 15,
    "cookMinutes": 55,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/potato-rib-stew.png",
      "alt": "土豆炖排骨成品示意图：深盘中酱色排骨与黄色土豆块，汤汁浓稠",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "猪肋排",
      "土豆",
      "姜",
      "大葱",
      "八角"
    ],
    "allergenTags": [
      "猪肉",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "pork-rib",
            "name": "猪肋排",
            "amount": 700,
            "unit": "克",
            "scalable": true,
            "note": "剁成 5 厘米段"
          },
          {
            "id": "potato",
            "name": "土豆",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约 2 个，切滚刀块"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 4,
            "unit": "片",
            "scalable": true
          },
          {
            "id": "scallion",
            "name": "大葱",
            "amount": 1,
            "unit": "段",
            "scalable": true
          },
          {
            "id": "star-anise",
            "name": "八角",
            "amount": 2,
            "unit": "个",
            "scalable": true
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 30,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "dark-soy",
            "name": "老抽",
            "amount": 8,
            "unit": "毫升",
            "scalable": true,
            "note": "上色用"
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "rock-sugar",
            "name": "冰糖",
            "amount": 15,
            "unit": "克",
            "scalable": true
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 3 克（按口味调整）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "hot-water",
            "name": "热水",
            "amount": 1000,
            "unit": "毫升",
            "scalable": true,
            "note": "炖煮用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "排骨泡水去血",
        "text": "排骨剁成五厘米长的段，冷水浸泡二十分钟，中途换一次水。土豆去皮切滚刀块，泡在清水里，防止表面氧化发黑。",
        "image": {
          "src": "/images/recipes/potato-rib-stew-step-1.png",
          "alt": "步骤 1 示意图：盆中清水泡着排骨，另一盆水里浸着切好的土豆块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 20 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "冷水下锅焯排骨",
        "text": "排骨冷水下锅，加两片姜和料酒，大火煮开后撇净浮沫，再煮两分钟捞出，用温水冲净表面的浮沫。",
        "image": {
          "src": "/images/recipes/potato-rib-stew-step-2.png",
          "alt": "步骤 2 示意图：锅中排骨焯水，浮沫被撇到锅边，漏勺正准备捞出排骨",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "大火"
      },
      {
        "index": 3,
        "title": "炒糖色煸排骨",
        "text": "锅中倒油，小火放冰糖炒到融化变琥珀色，下排骨翻炒上色，再加葱段、姜片和八角，炒出香味。",
        "image": {
          "src": "/images/recipes/potato-rib-stew-step-3.png",
          "alt": "步骤 3 示意图：排骨在锅中翻炒，表面裹上琥珀色糖色，旁边有八角",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 4 分钟",
        "heat": "小火"
      },
      {
        "index": 4,
        "title": "加酱油热水慢炖",
        "text": "沿锅边淋料酒，加生抽和老抽翻匀，倒入没过排骨的热水。大火烧开后转小火，盖盖炖三十分钟。",
        "image": {
          "src": "/images/recipes/potato-rib-stew-step-4.png",
          "alt": "步骤 4 示意图：炖锅中排骨浸在酱色汤汁里，水面微微冒泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 30 分钟",
        "heat": "小火"
      },
      {
        "index": 5,
        "title": "下土豆再炖软",
        "text": "放入沥干的土豆块，用铲子轻轻推匀，继续小火炖十五分钟，炖到筷子能轻松插入土豆和排骨。",
        "image": {
          "src": "/images/recipes/potato-rib-stew-step-5.png",
          "alt": "步骤 5 示意图：土豆块加入炖锅，与排骨一同浸在汤汁中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 15 分钟",
        "heat": "小火"
      },
      {
        "index": 6,
        "title": "收汁调味出锅",
        "text": "挑出葱姜和八角，尝味后补盐。转中大火收汁，边收边翻动，汤汁收到能裹住排骨、表面泛油光即可出锅。",
        "image": {
          "src": "/images/recipes/potato-rib-stew-step-6.png",
          "alt": "步骤 6 示意图：锅中汤汁收浓裹住排骨和土豆，表面泛着油光",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "中大火"
      }
    ],
    "tips": [
      "土豆后放，早放会炖成泥，把汤汁变糊。",
      "排骨先煸炒上色再炖，比直接下锅更香，糖色炒到琥珀色就下排骨。",
      "收汁时勤翻动，土豆含淀粉，很容易粘锅底。"
    ],
    "substitutions": [
      "排骨可换成猪颈骨或脊骨，炖煮时间延长十分钟。",
      "土豆可换成山药或芋头，芋头更易糊汤，需缩短炖煮时间。",
      "不吃八角和桂皮类香料，可以用两片香叶替代，风味更轻。"
    ],
    "failures": [
      "汤汁发浑：土豆下锅后大火猛煮导致淀粉糊化；保持小火，收汁时再转大火。",
      "排骨不入味：炖煮时间不足或水加太多；水面刚没过食材，炖足四十五分钟以上。",
      "排骨发腥：血水没泡透或浮沫没撇净；冷水浸泡，冷水下锅焯。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "scallion-oil-noodles",
    "name": "葱油拌面",
    "subtitle": "葱香浓郁的上海味道",
    "intro": "小葱擦干水分，冷油下锅慢慢熬到焦黄，葱香全部留在油里，再倒入生抽老抽调成的酱汁。面条煮到八分熟就捞，拌上两勺葱油，酱色均匀、葱香扑鼻。适合早餐或不想做菜的午餐，一碗就够。",
    "cuisine": "江浙",
    "tastes": [
      "咸鲜",
      "酱香"
    ],
    "mealTypes": [
      "breakfast",
      "lunch"
    ],
    "baseServings": 2,
    "prepMinutes": 12,
    "cookMinutes": 16,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/scallion-oil-noodles.png",
      "alt": "葱油拌面成品示意图：酱色面条盘在碗中，上面摆着焦黄葱段",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "面条",
      "小葱",
      "生抽"
    ],
    "allergenTags": [
      "麸质",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "noodles",
            "name": "细面条",
            "amount": 200,
            "unit": "克",
            "scalable": true,
            "note": "碱水面或阳春面"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 8,
            "unit": "根",
            "scalable": true,
            "note": "约 100 克，葱白葱绿分开"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 80,
            "unit": "毫升",
            "scalable": true,
            "note": "熬葱油用，剩下的可冷藏留用"
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 3,
            "unit": "勺",
            "scalable": true,
            "note": "约 45 毫升"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "dark-soy",
            "name": "老抽",
            "amount": 1,
            "unit": "勺",
            "scalable": true,
            "note": "上色，可省略"
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "提鲜，不放会偏咸"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "克",
            "display": "少许（煮面用）",
            "scalable": false
          },
          {
            "id": "lard",
            "name": "猪油",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "可选，增香"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "小葱洗净彻底擦干",
        "text": "小葱择掉黄叶，连根洗净，用厨房纸把水彻底吸干，再摊开晾 10 分钟。带水下锅会炸油，也会让葱段软塌不脆。",
        "image": {
          "src": "/images/recipes/scallion-oil-noodles-step-1.png",
          "alt": "步骤 1 示意图：厨房纸上摊开的小葱，水珠已被吸干",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 10 分钟"
      },
      {
        "index": 2,
        "title": "葱白葱绿切长段",
        "text": "葱白切成 5 厘米长的段，葱绿切成同样长度，分开放；葱白耐熬先下锅，葱绿后放，这样两段都能焦而不糊。",
        "image": {
          "src": "/images/recipes/scallion-oil-noodles-step-2.png",
          "alt": "步骤 2 示意图：案板上分开放置的葱白段与葱绿段",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 3,
        "title": "冷油下葱小火慢熬",
        "text": "锅里倒 80 毫升食用油，放入葱白，开小火，油面刚起小泡时开始计时。保持小火熬 6 分钟，中途翻动两次，让葱段受热均匀。",
        "image": {
          "src": "/images/recipes/scallion-oil-noodles-step-3.png",
          "alt": "步骤 3 示意图：葱白段在冷油中慢慢冒泡，边缘开始泛黄",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 6 分钟"
      },
      {
        "index": 4,
        "title": "葱段焦黄后下酱汁",
        "text": "葱白变成浅褐色时放入葱绿，再熬 2 分钟至葱段干瘪焦黄，用筷子夹出。关火等油温降到不冒烟，倒入生抽、老抽和白糖，再开小火搅到糖化。",
        "image": {
          "src": "/images/recipes/scallion-oil-noodles-step-4.png",
          "alt": "步骤 4 示意图：锅中葱段焦黄，酱油正倒入油中泛起细泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "小火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 5,
        "title": "另起一锅煮面条",
        "text": "另取一锅水烧开，加一小撮盐，下 200 克面条，用筷子挑散。煮到面条中间还有一点白芯就捞出，留半碗面汤备用。",
        "image": {
          "src": "/images/recipes/scallion-oil-noodles-step-5.png",
          "alt": "步骤 5 示意图：沸水锅中面条散开，筷子正在挑动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "大火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 6,
        "title": "趁热拌油再淋酱",
        "text": "面条沥干后趁热倒入两勺葱油，快速拌匀抖散；再按口味淋酱汁，加一勺面汤把酱化开，最后铺上葱段。",
        "image": {
          "src": "/images/recipes/scallion-oil-noodles-step-6.png",
          "alt": "步骤 6 示意图：面条在碗中被拌成酱色，葱段铺在表面",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 2 分钟"
      }
    ],
    "tips": [
      "葱一定擦干再下锅，带水会溅油，葱段也炸不脆。",
      "全程小火，油温太高葱一下就黑，苦味会盖住香味。",
      "酱汁要在关火后倒入，高温直接倒生抽容易糊锅发苦。"
    ],
    "substitutions": [
      "没有小葱可用红葱头 6 颗代替，切薄片熬，香气更甜。",
      "生抽可用薄盐生抽，老抽可省略，颜色会浅一些。",
      "猪油可换成等量葱油，素食版本不加即可。"
    ],
    "failures": [
      "葱发黑发苦：火太大或葱没擦干；冷油下锅、全程小火。",
      "面坨成块：煮好没趁热拌油；捞出后立刻拌油抖散，动作要快。",
      "太咸：生抽本身有盐，煮面时盐要少放，酱汁分两次淋。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "steamed-seabass",
    "name": "清蒸鲈鱼",
    "subtitle": "八分钟蒸出蒜瓣肉",
    "intro": "清蒸最考验火候，鲈鱼背厚肉嫩，水开后大火八分钟刚好，鱼肉一拨就成蒜瓣状。蒸出的腥水倒掉，换上新的葱丝，淋豉油、泼一勺热油，香味一下就起来了，适合晚餐配一碗白粥。",
    "cuisine": "粤式",
    "tastes": [
      "清淡",
      "咸鲜"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 12,
    "cookMinutes": 15,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/steamed-seabass.png",
      "alt": "清蒸鲈鱼成品示意图：长盘中整条鲈鱼淋着豉油，铺着葱丝和红椒丝",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "鲈鱼",
      "姜",
      "小葱",
      "红椒"
    ],
    "allergenTags": [
      "鱼",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "seabass",
            "name": "鲈鱼",
            "amount": 600,
            "unit": "克",
            "scalable": true,
            "note": "1 条，已去鳞去内脏"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 1,
            "unit": "块",
            "scalable": true,
            "note": "一半切片一半切丝"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 3,
            "unit": "根",
            "scalable": true,
            "note": "2 根垫底，1 根切细丝"
          },
          {
            "id": "red-chili",
            "name": "红椒",
            "amount": 1,
            "unit": "个",
            "scalable": true,
            "note": "四分之一个，切细丝"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "steamed-fish-soy",
            "name": "蒸鱼豉油",
            "amount": 30,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 10,
            "unit": "毫升",
            "scalable": true,
            "note": "抹鱼身去腥"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 2 克（薄薄一层）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 25,
            "unit": "毫升",
            "scalable": true,
            "note": "最后泼油用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "鲈鱼清理改花刀",
        "text": "鲈鱼去鳞、去鳃和内脏，刮净腹腔里的黑膜，用流动水冲干净。两面各斜划三刀，刀口深至鱼骨，让厚的地方也能均匀受热。",
        "image": {
          "src": "/images/recipes/steamed-seabass-step-1.png",
          "alt": "步骤 1 示意图：水槽中冲洗干净的鲈鱼，鱼身两侧已划出斜刀口",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "抹料酒垫姜葱",
        "text": "鱼身内外抹一层薄盐，淋料酒腌十分钟去腥。盘底横放两根葱段和几片姜，把鱼架在上面，鱼腹里也塞两片姜。",
        "image": {
          "src": "/images/recipes/steamed-seabass-step-2.png",
          "alt": "步骤 2 示意图：鱼盘底部垫着葱段姜片，鲈鱼被架空摆好",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 10 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 3,
        "title": "水开上锅大火蒸",
        "text": "蒸锅加水大火烧到上汽，把鱼盘放进去，盖严锅盖大火蒸八分钟。关火后不要开盖，利用余温再虚蒸两分钟。",
        "image": {
          "src": "/images/recipes/steamed-seabass-step-3.png",
          "alt": "步骤 3 示意图：蒸锅上汽，锅盖边缘冒出白色蒸汽，鱼盘放在蒸架上",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 10 分钟",
        "heat": "大火"
      },
      {
        "index": 4,
        "title": "倒腥水换新葱丝",
        "text": "端出鱼盘，倒掉盘里的汤水，夹走蒸过的姜葱。重新铺上细葱丝和红椒丝，葱丝尽量切得细而长，铺满鱼身。",
        "image": {
          "src": "/images/recipes/steamed-seabass-step-4.png",
          "alt": "步骤 4 示意图：蒸好的鲈鱼上铺满细葱丝和红椒丝，盘中汤汁已倒空",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "关火"
      },
      {
        "index": 5,
        "title": "淋豉油泼热油",
        "text": "沿盘边淋入蒸鱼豉油，不要直接浇在鱼身上。另起锅把食用油烧到微微冒烟，趁热浇在葱丝上，听到滋啦声即可上桌。",
        "image": {
          "src": "/images/recipes/steamed-seabass-step-5.png",
          "alt": "步骤 5 示意图：热油浇在葱丝上冒出白烟，豉油在盘底显出深色",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "大火"
      }
    ],
    "tips": [
      "鱼一定要等水开上汽后再入锅，冷水上锅蒸出来肉会散。",
      "蒸出来的汤水腥味最重，必须倒掉，再沿盘边淋新的豉油。",
      "一斤左右的鱼蒸八分钟，每增加二两多蒸一分钟。"
    ],
    "substitutions": [
      "鲈鱼可换成鳜鱼、黄鱼或多宝鱼，按鱼身厚度调整蒸制时间。",
      "没有蒸鱼豉油，可用生抽加少量白糖和清水调开代替。",
      "红椒丝只为配色，换成胡萝卜丝或不放都可以。"
    ],
    "failures": [
      "鱼肉发老：蒸的时间过长或没虚蒸就开盖；八分钟加两分钟虚蒸足够。",
      "腥味重：腹腔黑膜没刮净，或蒸出的汤水没倒掉；这两步都不能省。",
      "鱼皮破损：火太小或鱼身没擦干；大火足汽、盘底垫葱姜把鱼架空。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "teriyaki-chicken-rice",
    "name": "照烧鸡腿饭",
    "subtitle": "皮脆肉嫩的日式盖饭",
    "intro": "照烧汁只用生抽、蜂蜜和料酒就能调出来，鸡皮朝下煎到金黄酥脆，再用酱汁慢慢收浓裹在鸡肉上，甜咸适口、油亮不腻。配一碗热米饭和几根焯青菜，就是一份完整的工作日午餐，也很适合装进便当带走。",
    "cuisine": "日韩",
    "tastes": [
      "咸鲜",
      "微甜"
    ],
    "mealTypes": [
      "lunch"
    ],
    "baseServings": 2,
    "prepMinutes": 15,
    "cookMinutes": 20,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/teriyaki-chicken-rice.png",
      "alt": "照烧鸡腿饭成品示意图：切条鸡腿肉铺在白米饭上，旁配绿色西兰花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "鸡腿肉",
      "米饭",
      "西兰花"
    ],
    "allergenTags": [
      "鸡肉",
      "大豆",
      "麸质"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "chicken-thigh",
            "name": "去骨鸡腿肉",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "2 块，带皮"
          },
          {
            "id": "rice",
            "name": "米饭",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约 2 碗，提前煮好"
          },
          {
            "id": "broccoli",
            "name": "西兰花",
            "amount": 150,
            "unit": "克",
            "scalable": true,
            "note": "掰小朵，焯水备用"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 30,
            "unit": "毫升",
            "scalable": true,
            "note": "调照烧汁"
          },
          {
            "id": "dark-soy",
            "name": "老抽",
            "amount": 5,
            "unit": "毫升",
            "scalable": true,
            "note": "补色，可省略"
          },
          {
            "id": "honey",
            "name": "蜂蜜",
            "amount": 20,
            "unit": "克",
            "scalable": true,
            "note": "提供甜味和亮泽"
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 60,
            "unit": "毫升",
            "scalable": true,
            "note": "调汁用"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 10,
            "unit": "毫升",
            "scalable": true,
            "note": "只需薄薄一层"
          },
          {
            "id": "sesame",
            "name": "白芝麻",
            "amount": 3,
            "unit": "克",
            "scalable": true,
            "note": "熟的，最后撒面"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "鸡腿去骨调照烧汁",
        "text": "鸡腿肉用剪刀沿骨头剪开，去骨后把厚的地方片薄，皮面朝上用刀背轻拍平整。取小碗放入生抽、老抽、蜂蜜、料酒和清水，搅匀成照烧汁备用。",
        "image": {
          "src": "/images/recipes/teriyaki-chicken-rice-step-1.png",
          "alt": "步骤 1 示意图：去骨鸡腿皮面朝上放在砧板上，旁边是一小碗调好的酱汁",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "鸡皮朝下煎出油",
        "text": "平底锅烧热后倒少许油，鸡腿皮朝下放入，用铲子压住让鸡皮全面接触锅底。中火煎四到五分钟，听到持续的滋滋声、鸡皮变成金黄焦脆再翻面。",
        "image": {
          "src": "/images/recipes/teriyaki-chicken-rice-step-2.png",
          "alt": "步骤 2 示意图：平底锅中鸡腿皮朝下煎至金黄，铲子压住鸡腿",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "中火"
      },
      {
        "index": 3,
        "title": "翻面煎至七成熟",
        "text": "翻面后继续煎两分钟，鸡肉表面变白、按下去有弹性即可。煎出的鸡油如果太多，可以倒掉一部分，避免后面酱汁过于油腻。",
        "image": {
          "src": "/images/recipes/teriyaki-chicken-rice-step-3.png",
          "alt": "步骤 3 示意图：鸡腿翻面后锅中冒着热气，鸡皮已呈焦黄色",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "中火"
      },
      {
        "index": 4,
        "title": "倒入照烧汁收浓",
        "text": "把调好的照烧汁倒入锅中，转中小火让酱汁在鸡肉周围冒小泡。用勺子不断把酱汁浇在鸡肉上，收到汁液变稠、能挂在肉表面就关火。",
        "image": {
          "src": "/images/recipes/teriyaki-chicken-rice-step-4.png",
          "alt": "步骤 4 示意图：锅中酱汁冒泡变稠，勺子正把酱汁淋在鸡腿肉上",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 4 分钟",
        "heat": "中小火"
      },
      {
        "index": 5,
        "title": "切条铺饭配时蔬",
        "text": "鸡肉取出静置一分钟再切成一厘米宽的条，铺在盛好的米饭上，淋上锅里剩下的酱汁。旁边摆焯过水的西兰花，最后撒白芝麻即可。",
        "image": {
          "src": "/images/recipes/teriyaki-chicken-rice-step-5.png",
          "alt": "步骤 5 示意图：切条鸡腿肉铺在米饭上并淋汁，旁边摆西兰花",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 3 分钟",
        "heat": "关火"
      }
    ],
    "tips": [
      "鸡皮下锅前一定要擦干，带水下锅会爆油，皮也煎不脆。",
      "照烧汁收到能挂住勺子就够了，收过头会发苦、发黏。",
      "鸡肉煎好后静置一分钟再切，肉汁不会流失到砧板上。"
    ],
    "substitutions": [
      "没有蜂蜜可用 12 克白糖加 5 毫升清水代替，成品色泽会稍浅。",
      "西兰花可换成焯水的荷兰豆或小油菜，焯水时间都控制在半分钟。",
      "去骨鸡腿可换成鸡胸肉，需缩短煎制时间，并在酱汁里多加 10 毫升水。"
    ],
    "failures": [
      "鸡皮不脆：下锅前没擦干或火太小，鸡皮在油里被焖软；应中火皮朝下先煎足四分钟。",
      "酱汁发苦：蜂蜜或糖在锅里收得太久焦化；汁一变稠就关火，余温还会继续收。",
      "鸡肉发柴：煎制时间过长或反复翻面；每面只翻一次，中心刚变白即可。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "three-fresh-dumplings",
    "name": "三鲜水饺",
    "subtitle": "猪肉虾仁韭菜的经典馅",
    "intro": "三鲜馅的关键是肉馅先打水，再拌入虾仁和鸡蛋碎，煮出来咬开有汤汁，虾仁还带着弹性。用现成的饺子皮能省下和面的时间，一次包四十个，冻一半留给下一个工作日当午饭。",
    "cuisine": "北方",
    "tastes": [
      "咸鲜",
      "鲜香"
    ],
    "mealTypes": [
      "lunch"
    ],
    "baseServings": 3,
    "prepMinutes": 40,
    "cookMinutes": 15,
    "difficulty": 3,
    "image": {
      "src": "/images/recipes/three-fresh-dumplings.png",
      "alt": "三鲜水饺成品示意图：白瓷盘中摆着月牙形水饺，旁配一小碟醋",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "猪肉馅",
      "虾仁",
      "鸡蛋",
      "韭菜",
      "饺子皮"
    ],
    "allergenTags": [
      "麸质",
      "甲壳类",
      "鸡蛋",
      "猪肉"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "pork-mince",
            "name": "猪肉馅",
            "amount": 300,
            "unit": "克",
            "scalable": true,
            "note": "肥三瘦七"
          },
          {
            "id": "shrimp",
            "name": "虾仁",
            "amount": 150,
            "unit": "克",
            "scalable": true,
            "note": "去虾线，切小丁"
          },
          {
            "id": "egg",
            "name": "鸡蛋",
            "amount": 2,
            "unit": "个",
            "scalable": true,
            "note": "1 个炒碎、1 个留作他用"
          },
          {
            "id": "chive",
            "name": "韭菜",
            "amount": 150,
            "unit": "克",
            "scalable": true,
            "note": "洗净晾干后切碎"
          },
          {
            "id": "dumpling-wrapper",
            "name": "现成饺子皮",
            "amount": 40,
            "unit": "张",
            "scalable": true,
            "note": "买中厚型的"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 10,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "sesame-oil",
            "name": "香油",
            "amount": 10,
            "unit": "毫升",
            "scalable": true,
            "note": "最后拌入锁水"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 15,
            "unit": "毫升",
            "scalable": true,
            "note": "炒蛋和拌馅用"
          },
          {
            "id": "ginger-mince",
            "name": "姜末",
            "amount": null,
            "unit": "",
            "display": "约 5 克",
            "scalable": false
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 5 克（分两次用）",
            "scalable": false
          },
          {
            "id": "white-pepper",
            "name": "白胡椒粉",
            "amount": null,
            "unit": "",
            "display": "少许",
            "scalable": false
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 50,
            "unit": "毫升",
            "scalable": true,
            "note": "打馅用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "虾仁改刀炒鸡蛋",
        "text": "虾仁挑去虾线，用厨房纸吸干水分后切成小丁。鸡蛋打散，热锅少油炒成碎蛋花，盛出摊凉，炒得碎一点后面更好拌。",
        "image": {
          "src": "/images/recipes/three-fresh-dumplings-step-1.png",
          "alt": "步骤 1 示意图：砧板上切好的虾仁丁，旁边碗里是金黄的碎蛋花",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "中火"
      },
      {
        "index": 2,
        "title": "肉馅调味打上劲",
        "text": "猪肉馅里加生抽、料酒、姜末和一半的盐，分三次加入五十毫升清水，始终顺着一个方向搅，直到肉馅发黏、能抱成团。",
        "image": {
          "src": "/images/recipes/three-fresh-dumplings-step-2.png",
          "alt": "步骤 2 示意图：盆中肉馅被筷子顺同一方向搅出纹路，表面发亮",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 3,
        "title": "拌入三鲜馅料",
        "text": "把虾仁丁、碎蛋花和切碎的韭菜拌进肉馅，淋香油和食用油，撒剩下的盐和白胡椒粉，轻轻翻拌均匀，不要过度搅打。",
        "image": {
          "src": "/images/recipes/three-fresh-dumplings-step-3.png",
          "alt": "步骤 3 示意图：绿色韭菜、粉色虾仁和黄色蛋碎拌进肉馅中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 4 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 4,
        "title": "捏褶包成月牙饺",
        "text": "取一张饺子皮放在手心，中间放约十五克馅，边缘蘸一圈清水。对折后从一端捏起，捏出三到四个褶，最后把收口压紧。",
        "image": {
          "src": "/images/recipes/three-fresh-dumplings-step-4.png",
          "alt": "步骤 4 示意图：手指正在饺子皮边缘捏出褶子，旁边排着包好的饺子",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 15 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 5,
        "title": "三次点水煮饺子",
        "text": "锅中水烧开，下饺子后用勺背沿锅底推一圈防止粘底。水再次沸腾时点一小碗冷水，重复两次，饺子全部浮起、肚子鼓起即可。",
        "image": {
          "src": "/images/recipes/three-fresh-dumplings-step-5.png",
          "alt": "步骤 5 示意图：锅中饺子浮在沸水上，旁边一碗冷水正被倒入",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "大火"
      },
      {
        "index": 6,
        "title": "捞出配醋蒜上桌",
        "text": "用漏勺把饺子捞出沥干水装盘，趁热吃。蘸料用香醋加蒜末调开，喜欢辣的再加一勺辣椒油，配一碗饺子汤一起上桌。",
        "image": {
          "src": "/images/recipes/three-fresh-dumplings-step-6.png",
          "alt": "步骤 6 示意图：漏勺捞出饺子装盘，旁边小碟里是醋和蒜末",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 2 分钟",
        "heat": "关火"
      }
    ],
    "tips": [
      "打水要分次加，一次倒太多馅会澥，搅到水分完全吸收再添下一次。",
      "韭菜最后拌，拌好立刻包，放久了出水，饺子容易破皮。",
      "煮饺子点冷水是让皮和馅同步受热，不点水容易皮破馅生。"
    ],
    "substitutions": [
      "没有现成饺子皮，可用 300 克中筋面粉加 150 毫升水和面，醒三十分钟后擀皮。",
      "虾仁可换成同等重量的鲜贝或鱿鱼丁，都要切成小粒。",
      "不吃猪肉可换成鸡肉馅，需多加 10 毫升食用油防止发干。"
    ],
    "failures": [
      "饺子破皮：馅里水分太多或收口没捏紧；拌好的馅要能抱团，包之前把边缘蘸水捏实。",
      "馅发柴：肉馅没打水或全用瘦肉；选肥三瘦七的肉馅并分次加水。",
      "煮成一锅粥：水没开就下饺子或一直大火滚；水沸下锅，点两次冷水保持微沸。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "tomato-beef-brisket",
    "name": "番茄牛腩",
    "subtitle": "番茄分两次下，汤浓肉烂",
    "intro": "牛腩耐炖，和番茄是很稳的搭配。一半番茄炒成浓稠的底，另一半留到最后十分钟下锅，既有厚实的汤感，又能吃到完整的果肉。炖足一个半小时，牛腩筋膜变得软糯，拌饭或配馒头都合适。",
    "cuisine": "家常菜",
    "tastes": [
      "酸甜",
      "咸鲜"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 3,
    "prepMinutes": 20,
    "cookMinutes": 90,
    "difficulty": 3,
    "image": {
      "src": "/images/recipes/tomato-beef-brisket.png",
      "alt": "番茄牛腩成品示意图：白碗中红汤里沉着牛腩块与番茄块，点缀葱花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "牛腩",
      "番茄",
      "洋葱",
      "姜"
    ],
    "allergenTags": [
      "牛肉",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "beef-brisket",
            "name": "牛腩",
            "amount": 700,
            "unit": "克",
            "scalable": true,
            "note": "切 3 厘米块"
          },
          {
            "id": "tomato",
            "name": "番茄",
            "amount": 500,
            "unit": "克",
            "scalable": true,
            "note": "约 4 个，去皮后分两份"
          },
          {
            "id": "onion",
            "name": "洋葱",
            "amount": 0.5,
            "unit": "个",
            "scalable": true,
            "note": "切粗丝"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 4,
            "unit": "片",
            "scalable": true
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "tomato-paste",
            "name": "番茄酱",
            "amount": 40,
            "unit": "克",
            "scalable": true,
            "note": "让汤底更厚"
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 20,
            "unit": "毫升",
            "scalable": true,
            "note": "焯水用"
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 8,
            "unit": "克",
            "scalable": true,
            "note": "平衡酸味"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 3 克（按口味调整）",
            "scalable": false
          },
          {
            "id": "star-anise",
            "name": "八角",
            "amount": 1,
            "unit": "个",
            "scalable": true
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "hot-water",
            "name": "热水",
            "amount": 1200,
            "unit": "毫升",
            "scalable": true,
            "note": "一次加够"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "牛腩切块泡水",
        "text": "牛腩切成三厘米见方的块，放进冷水里泡三十分钟，中途换两次水，泡到水色变浅。姜切片，洋葱切粗丝备用。",
        "image": {
          "src": "/images/recipes/tomato-beef-brisket-step-1.png",
          "alt": "步骤 1 示意图：盆中清水泡着牛腩块，旁边放着切好的洋葱丝和姜片",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 30 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "冷水下锅焯透",
        "text": "牛腩冷水下锅，加姜片和料酒，大火煮开后撇净浮沫，继续煮三分钟。捞出后用温水冲洗，别用冷水，肉会收紧。",
        "image": {
          "src": "/images/recipes/tomato-beef-brisket-step-2.png",
          "alt": "步骤 2 示意图：锅中牛腩焯水，汤面浮沫被撇到一边，漏勺捞出肉块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "大火"
      },
      {
        "index": 3,
        "title": "番茄烫皮切两样",
        "text": "番茄顶部划十字，开水烫一分钟后去皮，去蒂。一半切成小丁，用来炒底；另一半切成大块，分别装碗放着。",
        "image": {
          "src": "/images/recipes/tomato-beef-brisket-step-3.png",
          "alt": "步骤 3 示意图：砧板上两个碗，分别装着番茄小丁和番茄大块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 4,
        "title": "炒出番茄浓底",
        "text": "锅中倒油，中火先炒洋葱到透明，再下番茄丁翻炒，用铲子压到化成糊状，加番茄酱炒出红油，闻到酸甜香即可。",
        "image": {
          "src": "/images/recipes/tomato-beef-brisket-step-4.png",
          "alt": "步骤 4 示意图：锅中番茄与洋葱炒成浓稠红色糊状，铲子正在翻压",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "中火"
      },
      {
        "index": 5,
        "title": "加水小火焖牛腩",
        "text": "放入牛腩和八角翻匀，加生抽和热水，大火烧开后转小火，盖盖焖七十分钟，直到筷子能轻松插透牛腩。",
        "image": {
          "src": "/images/recipes/tomato-beef-brisket-step-5.png",
          "alt": "步骤 5 示意图：炖锅中红汤没过牛腩，水面冒着细小气泡",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 70 分钟",
        "heat": "小火"
      },
      {
        "index": 6,
        "title": "下番茄块调味收汁",
        "text": "放入剩下的大块番茄，再炖十分钟，加盐和白糖调味。开盖转中火收五分钟，汤汁变浓、能挂在牛腩上即可关火。",
        "image": {
          "src": "/images/recipes/tomato-beef-brisket-step-6.png",
          "alt": "步骤 6 示意图：锅中加入大块番茄同炖，汤汁浓稠泛着红光",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 15 分钟",
        "heat": "中火"
      }
    ],
    "tips": [
      "番茄分两次下，先下的负责出汤，后下的保留果肉和清爽的酸味。",
      "牛腩焯水后用温水冲，冷水会让表面蛋白质骤缩，炖不烂。",
      "盐最后放，过早加盐会让牛肉失水，口感变硬。"
    ],
    "substitutions": [
      "牛腩可换成牛腱子或牛肋条，焖煮时间增加二十分钟。",
      "番茄酱可以省略，需多加一个番茄并把底炒得更久。",
      "洋葱可省略，用一根大葱的葱白部分替代。"
    ],
    "failures": [
      "牛腩咬不动：焖煮时间不足或一直大火翻滚；小火保持微沸，至少七十分钟。",
      "汤味寡淡：番茄底没炒透就加水；要炒到番茄完全化开、油色发红。",
      "汤发酸：后放的番茄块煮太久或糖不足；最后十分钟再下，并补少量糖。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "tomato-beef-noodle",
    "name": "番茄牛肉面",
    "subtitle": "酸甜汤底配软烂牛肉",
    "intro": "番茄先炒成沙再加水，汤色红亮、酸味柔和，牛肉在这锅汤里炖到能用筷子轻松插入。煮好的面条直接放进汤里，吸饱汤汁后比干拌更顺口，天冷的时候连汤一起吃完很舒服。",
    "cuisine": "家常菜",
    "tastes": [
      "酸甜",
      "咸鲜"
    ],
    "mealTypes": [
      "lunch"
    ],
    "baseServings": 2,
    "prepMinutes": 15,
    "cookMinutes": 40,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/tomato-beef-noodle.png",
      "alt": "番茄牛肉面成品示意图：白碗中面条浸在红色汤里，表面铺牛肉块与葱花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "牛腩",
      "番茄",
      "面条",
      "小葱"
    ],
    "allergenTags": [
      "牛肉",
      "麸质",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "beef-brisket",
            "name": "牛腩",
            "amount": 300,
            "unit": "克",
            "scalable": true,
            "note": "切 2 厘米块"
          },
          {
            "id": "tomato",
            "name": "番茄",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "约 3 个，去皮"
          },
          {
            "id": "noodle",
            "name": "面条",
            "amount": 200,
            "unit": "克",
            "scalable": true,
            "note": "鲜面或挂面均可"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 2,
            "unit": "根",
            "scalable": true,
            "note": "切葱花"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 3,
            "unit": "片",
            "scalable": true
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "tomato-paste",
            "name": "番茄酱",
            "amount": 30,
            "unit": "克",
            "scalable": true,
            "note": "增加汤色和浓度"
          },
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 15,
            "unit": "毫升",
            "scalable": true,
            "note": "焯水用"
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 5,
            "unit": "克",
            "scalable": true,
            "note": "平衡番茄酸味"
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 3 克（按口味调整）",
            "scalable": false
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 1200,
            "unit": "毫升",
            "scalable": true,
            "note": "炖汤用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "牛肉切块泡血水",
        "text": "牛腩逆着纹理切成两厘米见方的块，放进冷水里泡二十分钟，中途换一次水，把血水泡出来。姜切片，小葱切成葱花备用。",
        "image": {
          "src": "/images/recipes/tomato-beef-noodle-step-1.png",
          "alt": "步骤 1 示意图：砧板上切好的牛肉块，旁边一碗清水泡着牛肉",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 20 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "番茄烫皮切小块",
        "text": "番茄在顶部划十字，用开水烫三十秒后撕掉外皮，去蒂切块。其中一半再切碎一些，方便炒出沙；另一半切成大块，留到后面下锅。",
        "image": {
          "src": "/images/recipes/tomato-beef-noodle-step-2.png",
          "alt": "步骤 2 示意图：烫过开水的番茄正在去皮，砧板上有切好的番茄块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 3,
        "title": "牛肉焯水撇浮沫",
        "text": "牛腩冷水下锅，加姜片和料酒，大火煮开后撇净浮沫，再煮两分钟捞出，用温水冲掉表面附着的杂质。",
        "image": {
          "src": "/images/recipes/tomato-beef-noodle-step-3.png",
          "alt": "步骤 3 示意图：锅中牛肉焯水，水面浮着灰白色浮沫，勺子正在撇沫",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "大火"
      },
      {
        "index": 4,
        "title": "炒出番茄浓汤底",
        "text": "锅中倒油，中火下番茄碎翻炒，用铲子按压到变成糊状、锅底渗出红汁，加番茄酱再炒半分钟，油色变红即可。",
        "image": {
          "src": "/images/recipes/tomato-beef-noodle-step-4.png",
          "alt": "步骤 4 示意图：锅中番茄炒成糊状，油色泛红，铲子正在按压",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 4 分钟",
        "heat": "中火"
      },
      {
        "index": 5,
        "title": "下牛肉小火慢炖",
        "text": "下牛腩翻匀，加生抽和清水，大火烧开后转小火盖盖炖二十五分钟，再放入留下的大块番茄，继续炖五分钟至牛肉软烂。",
        "image": {
          "src": "/images/recipes/tomato-beef-noodle-step-5.png",
          "alt": "步骤 5 示意图：砂锅中红色汤汁微微冒泡，牛肉块浸在汤里",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 30 分钟",
        "heat": "小火"
      },
      {
        "index": 6,
        "title": "煮面浇汤撒葱花",
        "text": "另起锅煮面条，按包装时间少煮半分钟。汤里加盐和白糖调味，面条捞入碗中，浇上牛肉和热汤，撒葱花即可。",
        "image": {
          "src": "/images/recipes/tomato-beef-noodle-step-6.png",
          "alt": "步骤 6 示意图：面条盛入碗中，正被浇上红色牛肉汤并撒葱花",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 5 分钟",
        "heat": "中火"
      }
    ],
    "tips": [
      "番茄要炒到完全散开再加水，汤色才红亮，酸味也更柔和。",
      "牛腩用小火保持水面微微冒泡，大火翻滚会让肉变柴。",
      "面条单独煮，直接放进牛肉汤里煮会让整锅汤变浑浊。"
    ],
    "substitutions": [
      "牛腩可换成牛腱或牛肋条，炖煮时间需延长十到十五分钟。",
      "面条可换成刀削面、乌冬或米粉，米粉本身不含麸质。",
      "番茄酱可以省略，需多加一个番茄并把底炒得更久。"
    ],
    "failures": [
      "汤色寡淡：番茄没炒出沙就加水；要炒到番茄化成糊、油色发红再加水。",
      "牛肉嚼不动：炖煮时间不够或火太大；小火炖到筷子能轻松插入为止。",
      "汤发酸：番茄酱过多或糖不足；先加糖尝味，再决定是否补番茄酱。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "tomato-scrambled-egg",
    "name": "番茄炒蛋",
    "subtitle": "十分钟出锅的国民下饭菜",
    "intro": "番茄先炒出沙、鸡蛋回锅裹汁，是这道菜好吃的关键。全程大火快炒，十几分钟就能端上桌，适合工作日晚餐，也适合刚开始学做饭的人。",
    "cuisine": "家常菜",
    "tastes": [
      "咸鲜",
      "微甜"
    ],
    "mealTypes": [
      "lunch",
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 8,
    "cookMinutes": 7,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/tomato-scrambled-egg.png",
      "alt": "番茄炒蛋成品示意图：红色番茄块与金黄色鸡蛋盛在白盘中",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "番茄",
      "鸡蛋"
    ],
    "allergenTags": [
      "鸡蛋"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "tomato",
            "name": "番茄",
            "amount": 300,
            "unit": "克",
            "scalable": true,
            "note": "约 2 个中等大小，切滚刀块"
          },
          {
            "id": "egg",
            "name": "鸡蛋",
            "amount": 3,
            "unit": "个",
            "scalable": true,
            "note": "打散"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 1,
            "unit": "根",
            "scalable": true,
            "note": "切葱花"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 2 克（按口味调整）",
            "scalable": false
          },
          {
            "id": "sugar",
            "name": "白糖",
            "amount": 5,
            "unit": "克",
            "scalable": true,
            "note": "平衡番茄酸味"
          },
          {
            "id": "cooking-oil",
            "name": "食用油",
            "amount": 20,
            "unit": "毫升",
            "scalable": true
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "番茄切块、鸡蛋打散",
        "text": "番茄洗净去蒂，切成滚刀块；鸡蛋磕入碗中，加一小撮盐打散至蛋液均匀起小泡。小葱切成葱花备用。",
        "image": {
          "src": "/images/recipes/tomato-scrambled-egg-step-1.png",
          "alt": "步骤 1 示意图：番茄块、蛋液与葱花分装在碗中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 3 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "热锅炒蛋，七成熟盛出",
        "text": "锅烧热后倒一半食用油，油温五成热（筷子插入周围冒小泡）倒入蛋液。等底部凝固后用铲子从边缘向中间推，炒到七成熟、表面还有一点湿润时立刻盛出。",
        "image": {
          "src": "/images/recipes/tomato-scrambled-egg-step-2.png",
          "alt": "步骤 2 示意图：锅中蛋液凝固成块，铲子正从边缘推起",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 1 分钟",
        "heat": "中大火"
      },
      {
        "index": 3,
        "title": "炒出番茄沙",
        "text": "原锅补入剩下的油，下番茄块中火翻炒，用铲子轻轻按压，炒到番茄边缘变软、锅底出现红色汤汁。加白糖继续翻炒半分钟。",
        "image": {
          "src": "/images/recipes/tomato-scrambled-egg-step-3.png",
          "alt": "步骤 3 示意图：锅中番茄炒软出汁，铲子按压番茄块",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 3 分钟",
        "heat": "中火"
      },
      {
        "index": 4,
        "title": "鸡蛋回锅裹汁",
        "text": "把炒好的鸡蛋倒回锅中，转大火快速翻炒，让蛋块均匀裹上番茄汁。尝味后补盐，撒葱花翻两下即可关火。",
        "image": {
          "src": "/images/recipes/tomato-scrambled-egg-step-4.png",
          "alt": "步骤 4 示意图：蛋块与番茄在锅中翻炒裹汁",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 1 分钟",
        "heat": "大火"
      },
      {
        "index": 5,
        "title": "装盘",
        "text": "盛出后把锅底的番茄汁淋在表面，趁热配米饭食用。喜欢汤汁多的，可以在步骤 3 加两勺清水一起炒。",
        "image": {
          "src": "/images/recipes/tomato-scrambled-egg-step-5.png",
          "alt": "步骤 5 示意图：番茄炒蛋盛盘并淋上汤汁",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 1 分钟",
        "heat": "关火"
      }
    ],
    "tips": [
      "鸡蛋只炒到七成熟就盛出，回锅后还会继续受热，这样口感更嫩。",
      "番茄要炒到出沙再放鸡蛋，汤汁才会挂在蛋块上。",
      "番茄偏酸时可把白糖加到 8 克，但不要省略，糖的作用是平衡酸味而不是让菜变甜。"
    ],
    "substitutions": [
      "没有小葱可以不放，或换成 1/4 个洋葱切碎同炒。",
      "不吃鸡蛋可换成 200 克嫩豆腐，先煎至两面微黄再按同样步骤回锅。",
      "番茄可用同等重量的圣女果替代，需对半切开并适当延长翻炒时间。"
    ],
    "failures": [
      "出水太多：番茄没炒出沙就放蛋，或火太小导致番茄慢慢渗水；应中火炒到锅底见红汁再回锅。",
      "鸡蛋发老：炒蛋时间过长或油温过高；蛋液下锅后凝固即推散，七成熟盛出。",
      "味道寡淡：盐分两次放（蛋液一次、出锅一次），比一次放更均匀。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "winter-melon-meatball-soup",
    "name": "冬瓜丸子汤",
    "subtitle": "清汤丸子，鲜而不腻",
    "intro": "汤清、丸嫩、冬瓜透亮，是这道汤的三个标准。肉馅顺一个方向打到上劲，丸子下锅才不会散；冬瓜最后放，煮到边缘透明就关火，久煮会化成水。晚餐配一小碗米饭，喝完全身都松快。",
    "cuisine": "家常菜",
    "tastes": [
      "清淡",
      "咸鲜"
    ],
    "mealTypes": [
      "dinner"
    ],
    "baseServings": 2,
    "prepMinutes": 15,
    "cookMinutes": 20,
    "difficulty": 2,
    "image": {
      "src": "/images/recipes/winter-melon-meatball-soup.png",
      "alt": "冬瓜丸子汤成品示意图：白瓷碗中清汤里浮着肉丸与半透明冬瓜块，撒葱花",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "冬瓜",
      "猪肉馅",
      "鸡蛋",
      "姜",
      "小葱"
    ],
    "allergenTags": [
      "猪肉",
      "鸡蛋",
      "大豆"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "winter-melon",
            "name": "冬瓜",
            "amount": 400,
            "unit": "克",
            "scalable": true,
            "note": "去皮去瓤，切厚块"
          },
          {
            "id": "pork-mince",
            "name": "猪肉馅",
            "amount": 250,
            "unit": "克",
            "scalable": true,
            "note": "肥三瘦七"
          },
          {
            "id": "egg",
            "name": "鸡蛋",
            "amount": 1,
            "unit": "个",
            "scalable": true,
            "note": "只取蛋清"
          },
          {
            "id": "ginger",
            "name": "姜",
            "amount": 2,
            "unit": "片",
            "scalable": true,
            "note": "一片切末，一片煮汤"
          },
          {
            "id": "scallion",
            "name": "小葱",
            "amount": 2,
            "unit": "根",
            "scalable": true,
            "note": "一半切段一半切葱花"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "light-soy",
            "name": "生抽",
            "amount": 10,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "cooking-wine",
            "name": "料酒",
            "amount": 10,
            "unit": "毫升",
            "scalable": true
          },
          {
            "id": "cornstarch",
            "name": "玉米淀粉",
            "amount": 15,
            "unit": "克",
            "scalable": true,
            "note": "让丸子更嫩"
          },
          {
            "id": "sesame-oil",
            "name": "香油",
            "amount": 5,
            "unit": "毫升",
            "scalable": true,
            "note": "出锅前淋入"
          },
          {
            "id": "white-pepper",
            "name": "白胡椒粉",
            "amount": null,
            "unit": "",
            "display": "少许",
            "scalable": false
          },
          {
            "id": "salt",
            "name": "盐",
            "amount": null,
            "unit": "",
            "display": "约 3 克（分两次用）",
            "scalable": false
          },
          {
            "id": "water",
            "name": "清水",
            "amount": 900,
            "unit": "毫升",
            "scalable": true,
            "note": "煮汤用"
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "冬瓜去皮切厚块",
        "text": "冬瓜削皮去瓤，切成两厘米厚的块，块大一点煮完不容易碎。姜切细末，小葱一半切段，另一半切成葱花备用。",
        "image": {
          "src": "/images/recipes/winter-melon-meatball-soup-step-1.png",
          "alt": "步骤 1 示意图：砧板上切好的冬瓜厚块，旁边是姜末和葱段",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 2,
        "title": "肉馅搅打上劲",
        "text": "猪肉馅里加盐、生抽、料酒、姜末、白胡椒粉和一个蛋清，顺一个方向搅打三分钟，再加玉米淀粉搅到发黏抱团。",
        "image": {
          "src": "/images/recipes/winter-melon-meatball-soup-step-2.png",
          "alt": "步骤 2 示意图：碗中肉馅被筷子搅出明显纹路，表面有光泽",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "暂不开火"
      },
      {
        "index": 3,
        "title": "虎口挤丸入温水",
        "text": "锅中加清水和姜片，烧到锅底冒小泡、水面将开未开时转最小火。左手虎口挤出丸子，右手用蘸过水的勺子刮入锅中。",
        "image": {
          "src": "/images/recipes/winter-melon-meatball-soup-step-3.png",
          "alt": "步骤 3 示意图：虎口挤出的肉丸正被勺子刮入微沸的水中",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 6 分钟",
        "heat": "小火"
      },
      {
        "index": 4,
        "title": "丸子浮起撇沫",
        "text": "全部丸子下锅后转中火，水微微沸腾时撇去表面浮沫，煮三分钟到丸子全部浮起，用勺子按一下有弹性。",
        "image": {
          "src": "/images/recipes/winter-melon-meatball-soup-step-4.png",
          "alt": "步骤 4 示意图：丸子全部浮在水面，汤面飘着少许浮沫被撇走",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 4 分钟",
        "heat": "中火"
      },
      {
        "index": 5,
        "title": "下冬瓜煮至透明",
        "text": "下冬瓜块煮六到八分钟，煮到边缘透明。加盐和白胡椒粉调味，淋香油，撒葱花和葱段，关火即可。",
        "image": {
          "src": "/images/recipes/winter-melon-meatball-soup-step-5.png",
          "alt": "步骤 5 示意图：冬瓜块在汤中煮至边缘透明，葱花撒在汤面",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "timeHint": "约 8 分钟",
        "heat": "中火"
      }
    ],
    "tips": [
      "肉馅要搅到上劲，筷子插进去能立住，丸子下锅才不散。",
      "下丸子时水不能大滚，否则丸子会被冲散，保持微沸即可。",
      "冬瓜煮到边缘透明就关火，余温还会继续加热，久煮会化。"
    ],
    "substitutions": [
      "猪肉馅可换成鸡肉馅或现成虾滑，口感更清爽。",
      "冬瓜可换成丝瓜或白萝卜，萝卜需多煮五分钟。",
      "玉米淀粉可换成等量土豆淀粉，用量一致。"
    ],
    "failures": [
      "丸子散在汤里：肉馅没上劲或水太滚；顺一个方向搅打，微沸下锅。",
      "汤浑浊发腥：浮沫没撇净或一直大火滚煮；撇沫后保持中小火。",
      "丸子发硬：淀粉加太多或煮过头；淀粉不超过肉馅的十分之一。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  },
  {
    "id": "yogurt-fruit-bowl",
    "name": "酸奶水果燕麦碗",
    "subtitle": "不用开火的酸甜早餐",
    "intro": "浓稠的无糖酸奶铺底，撒上烤得微脆的燕麦片，再码一层水果，最后淋一点蜂蜜。吃的时候从底下往上舀，酸、甜、脆三种口感都在一勺里。适合夏天没胃口或想吃得清爽的早晨，提前烤好燕麦能连做几天。",
    "cuisine": "轻食",
    "tastes": [
      "酸甜",
      "奶香"
    ],
    "mealTypes": [
      "breakfast"
    ],
    "baseServings": 1,
    "prepMinutes": 8,
    "cookMinutes": 4,
    "difficulty": 1,
    "image": {
      "src": "/images/recipes/yogurt-fruit-bowl.png",
      "alt": "酸奶水果燕麦碗成品示意图：白碗中酸奶上铺着蓝莓、香蕉片与燕麦脆",
      "kind": "illustration",
      "credit": "本项目原创示意图（脚本绘制，非实拍）",
      "note": "示意图，非实拍"
    },
    "mainIngredients": [
      "无糖酸奶",
      "燕麦片",
      "蓝莓",
      "香蕉"
    ],
    "allergenTags": [
      "乳制品",
      "坚果"
    ],
    "ingredientGroups": [
      {
        "id": "main",
        "title": "主料",
        "items": [
          {
            "id": "yogurt",
            "name": "无糖酸奶",
            "amount": 200,
            "unit": "克",
            "scalable": true,
            "note": "选浓稠型，希腊酸奶更好"
          },
          {
            "id": "oats",
            "name": "即食燕麦片",
            "amount": 30,
            "unit": "克",
            "scalable": true,
            "note": "平底锅烤香"
          },
          {
            "id": "blueberry",
            "name": "蓝莓",
            "amount": 60,
            "unit": "克",
            "scalable": true,
            "note": "洗净沥干"
          },
          {
            "id": "banana",
            "name": "香蕉",
            "amount": 0.5,
            "unit": "根",
            "scalable": true,
            "note": "斜切薄片"
          },
          {
            "id": "mixed-nuts",
            "name": "混合坚果",
            "amount": 10,
            "unit": "克",
            "scalable": true,
            "note": "掰碎，可省略"
          }
        ]
      },
      {
        "id": "seasoning",
        "title": "调料",
        "items": [
          {
            "id": "honey",
            "name": "蜂蜜",
            "amount": 1,
            "unit": "茶匙",
            "scalable": true,
            "note": "按水果甜度增减"
          },
          {
            "id": "cinnamon",
            "name": "肉桂粉",
            "amount": null,
            "unit": "克",
            "display": "一小撮（可省略）",
            "scalable": false
          }
        ]
      }
    ],
    "steps": [
      {
        "index": 1,
        "title": "干锅烤香燕麦片",
        "text": "平底锅不放油，中小火烧热后倒入 30 克燕麦片，摊平烘 2 分钟，闻到麦香、边缘微微发黄就盛出摊凉，凉了才会脆。",
        "image": {
          "src": "/images/recipes/yogurt-fruit-bowl-step-1.png",
          "alt": "步骤 1 示意图：干锅中燕麦片微微发黄，木铲正在翻动",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "中小火",
        "timeHint": "约 4 分钟"
      },
      {
        "index": 2,
        "title": "水果洗净切好",
        "text": "蓝莓放滤网里用流水冲一遍，沥干水；香蕉剥皮斜切成 5 毫米厚的片，切好马上用，放久了会发黑。",
        "image": {
          "src": "/images/recipes/yogurt-fruit-bowl-step-2.png",
          "alt": "步骤 2 示意图：滤网中的蓝莓沥水，案板上摆着香蕉片",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 3 分钟"
      },
      {
        "index": 3,
        "title": "酸奶铺底压平",
        "text": "取一个宽口碗，倒入 200 克酸奶，用勺背轻轻压平，中间稍微凹下去一点，方便后面堆水果和燕麦。",
        "image": {
          "src": "/images/recipes/yogurt-fruit-bowl-step-3.png",
          "alt": "步骤 3 示意图：宽口碗中酸奶被勺背压平，表面留出浅窝",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 1 分钟"
      },
      {
        "index": 4,
        "title": "分层铺燕麦与水果",
        "text": "先撒一半烤燕麦，再沿碗边摆蓝莓、中间叠香蕉片，剩下的燕麦撒在中间；坚果掰碎后点缀在表面。",
        "image": {
          "src": "/images/recipes/yogurt-fruit-bowl-step-4.png",
          "alt": "步骤 4 示意图：酸奶碗中蓝莓沿边排开，香蕉片叠在中央",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "暂不开火",
        "timeHint": "约 2 分钟"
      },
      {
        "index": 5,
        "title": "淋蜂蜜即刻开吃",
        "text": "吃之前淋 1 茶匙蜂蜜，撒一小撮肉桂粉。燕麦的脆度只能保持 5 分钟，想留脆口感就把燕麦单独装小碟。",
        "image": {
          "src": "/images/recipes/yogurt-fruit-bowl-step-5.png",
          "alt": "步骤 5 示意图：蜂蜜正淋在水果燕麦碗上，碗边放着勺子",
          "kind": "illustration",
          "credit": "本项目原创示意图（脚本绘制，非实拍）",
          "note": "示意图，非实拍"
        },
        "heat": "关火",
        "timeHint": "约 1 分钟"
      }
    ],
    "tips": [
      "燕麦片一定要摊凉再铺，热的会把酸奶烫稀、水果出水。",
      "酸奶选配料表只有生牛乳和菌种的，水果本身够甜就不必多加蜂蜜。",
      "想第二天省事，燕麦可以前一晚烤好，密封罐常温放 2 天。"
    ],
    "substitutions": [
      "无糖酸奶可换成希腊酸奶或椰子酸奶，后者不含乳制品，奶香偏淡。",
      "蓝莓可换成草莓丁或猕猴桃丁，酸度高的水果多淋半茶匙蜂蜜。",
      "坚果可以省略，或换成南瓜籽、椰片，同样有脆度。"
    ],
    "failures": [
      "出水变稀：水果没沥干或提前几小时拌好；吃之前再组装。",
      "燕麦不脆：烤完没摊凉就盖盖子，水汽把它闷软了；摊在盘里晾 5 分钟再装罐。",
      "整体太酸：用了风味酸奶又搭配酸水果；换成无糖酸奶并补一点蜂蜜。"
    ],
    "source": {
      "type": "original",
      "label": "本项目原创整理",
      "license": "CC BY 4.0（文字与示意图）",
      "note": "基于家庭常见做法整理，非转载；图片为项目脚本生成的示意图。"
    },
    "completeness": "complete",
    "createdAt": "2026-10-19T00:00:00.000Z",
    "updatedAt": "2026-10-19T00:00:00.000Z"
  }
];

export const VIDEOS: RecipeVideo[] = [
  {
    "id": "bili-BV1Tf4y1q7gW",
    "platform": "bilibili",
    "recipeId": "braised-pork",
    "title": "终于等到你，颤悠的红烧肉！国宴大厨揭秘家常版做法~",
    "author": "老饭骨",
    "authorId": "419872064",
    "url": "https://www.bilibili.com/video/BV1Tf4y1q7gW",
    "platformVideoId": "BV1Tf4y1q7gW",
    "durationSec": 211,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/0b8fda7a0715e30223b52e65ce94bd6e57231d27.jpg",
    "publishedAt": "2020-11-11T13:35:08.000Z",
    "stats": {
      "view": 3697766,
      "like": 80425
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:45.222Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「红烧肉」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1FV4y1c77K",
    "platform": "bilibili",
    "recipeId": "century-egg-pork-porridge",
    "title": "这才是皮蛋瘦肉粥的家常做法，浓稠香滑，鲜香味美喝它养胃又解馋",
    "author": "品味厨记",
    "authorId": "2060598540",
    "url": "https://www.bilibili.com/video/BV1FV4y1c77K",
    "platformVideoId": "BV1FV4y1c77K",
    "durationSec": 439,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/0ac6e3a851bea52fc107969ad3b211e6f4499ee2.jpg",
    "publishedAt": "2022-12-28T15:24:31.000Z",
    "stats": {
      "view": 761094,
      "like": 11602
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:46.838Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「皮蛋瘦肉粥」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1ZQAheJENh",
    "platform": "bilibili",
    "recipeId": "egg-veggie-pancake",
    "title": "妈妈们学会这个蔬菜鸡蛋饼！孩子一周的早餐都搞定！做法食材都很简单，营养也特别丰富！#蔬菜鸡蛋饼 #早餐吃什么 #早餐饼",
    "author": "夏叔有好货",
    "authorId": "294675407",
    "url": "https://www.bilibili.com/video/BV1ZQAheJENh",
    "platformVideoId": "BV1ZQAheJENh",
    "durationSec": 74,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/d9b72c976496f42472e3f99b7b79d495a700d15a.jpg",
    "publishedAt": "2025-02-18T10:32:18.000Z",
    "stats": {
      "view": 112326,
      "like": 12477
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:48.461Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「蔬菜鸡蛋饼」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1p6VZ6MEGm",
    "platform": "bilibili",
    "recipeId": "fish-fragrant-eggplant",
    "title": "鱼香茄子",
    "author": "阿虎美食记",
    "authorId": "3546952784415319",
    "url": "https://www.bilibili.com/video/BV1p6VZ6MEGm",
    "platformVideoId": "BV1p6VZ6MEGm",
    "durationSec": 180,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/51eb990aaf7d9c2e33fc006b1171881582e91d06.jpg",
    "publishedAt": "2026-06-01T11:00:41.000Z",
    "stats": {
      "view": 36179,
      "like": 1417
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:03.796Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「鱼香茄子」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1K3411J7cj",
    "platform": "bilibili",
    "recipeId": "garlic-broccoli",
    "title": "蒜蓉西兰花，炒之前多加一个步骤，做出来脆嫩入味，营养不流失",
    "author": "超子美食",
    "authorId": "403940805",
    "url": "https://www.bilibili.com/video/BV1K3411J7cj",
    "platformVideoId": "BV1K3411J7cj",
    "durationSec": 182,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/3e38345c570477a5a3627d9a4a185ec30860d7d3.jpg",
    "publishedAt": "2022-02-08T02:04:35.000Z",
    "stats": {
      "view": 415416,
      "like": 8552
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:50.012Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「蒜蓉西兰花」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1sP6SYREpE",
    "platform": "bilibili",
    "recipeId": "garlic-vermicelli-shrimp",
    "title": "蒜蓉粉丝蒸虾 | 新年简单硬菜、零难度、超好吃！",
    "author": "何时下厨",
    "authorId": "280429232",
    "url": "https://www.bilibili.com/video/BV1sP6SYREpE",
    "platformVideoId": "BV1sP6SYREpE",
    "durationSec": 96,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/58f539846fea0abc2823d240c508fd1ba27d2b38.jpg",
    "publishedAt": "2025-01-03T13:00:00.000Z",
    "stats": {
      "view": 87027,
      "like": 2540
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:51.661Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「蒜蓉粉丝蒸虾」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1xS4y167Qe",
    "platform": "bilibili",
    "recipeId": "green-pepper-pork",
    "title": "我做的“青椒肉丝”很好吃！步骤清晰详细、做法易学接地气",
    "author": "美食强",
    "authorId": "240869947",
    "url": "https://www.bilibili.com/video/BV1xS4y167Qe",
    "platformVideoId": "BV1xS4y167Qe",
    "durationSec": 144,
    "coverUrl": "https://i2.hdslb.com/bfs/archive/25048ce03005b80b42bfafb51afd959065b7387d.jpg",
    "publishedAt": "2022-02-28T10:51:08.000Z",
    "stats": {
      "view": 2653826,
      "like": 54550
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:53.194Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「青椒肉丝」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV14xHz65Eww",
    "platform": "bilibili",
    "recipeId": "ham-cheese-sandwich",
    "title": "法国人把火腿芝士三明治，做成了百年经典",
    "author": "奥路北山",
    "authorId": "11703549",
    "url": "https://www.bilibili.com/video/BV14xHz65Eww",
    "platformVideoId": "BV14xHz65Eww",
    "durationSec": 71,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/b7add4b90d1c5063bd85524d94f6768028d26ce5.jpg",
    "publishedAt": "2026-10-04T02:23:31.000Z",
    "stats": {
      "view": 12495,
      "like": 458
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:54.758Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「火腿芝士三明治」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1KiMB6rERm",
    "platform": "bilibili",
    "recipeId": "hand-torn-cabbage",
    "title": "手撕包菜",
    "author": "跟着伯通吃好饭",
    "authorId": "3707033844976356",
    "url": "https://www.bilibili.com/video/BV1KiMB6rERm",
    "platformVideoId": "BV1KiMB6rERm",
    "durationSec": 325,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/546de9f850e415533c6da373a7c6952173115f45.jpg",
    "publishedAt": "2026-08-04T15:48:26.000Z",
    "stats": {
      "view": 9149,
      "like": 568
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:56.332Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「手撕包菜」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1ai4y1o7EL",
    "platform": "bilibili",
    "recipeId": "kung-pao-chicken",
    "title": "大厨教你宫保鸡丁家常做法，步骤详细，糊辣酸甜，好吃解馋超下饭",
    "author": "超子美食",
    "authorId": "403940805",
    "url": "https://www.bilibili.com/video/BV1ai4y1o7EL",
    "platformVideoId": "BV1ai4y1o7EL",
    "durationSec": 277,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/4892d9907e1114ed5c97daf740a6d2d5daaa53c4.jpg",
    "publishedAt": "2021-11-24T03:41:32.000Z",
    "stats": {
      "view": 410556,
      "like": 7038
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:57.980Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「宫保鸡丁」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1md3NzzEnF",
    "platform": "bilibili",
    "recipeId": "mapo-tofu",
    "title": "【麻婆豆腐保姆级教程】",
    "author": "村驴",
    "authorId": "417298480",
    "url": "https://www.bilibili.com/video/BV1md3NzzEnF",
    "platformVideoId": "BV1md3NzzEnF",
    "durationSec": 209,
    "coverUrl": "https://i2.hdslb.com/bfs/archive/fd10a81771091b3f659443d220a457db3f646106.jpg",
    "publishedAt": "2025-06-30T01:43:18.000Z",
    "stats": {
      "view": 990734,
      "like": 40502
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:59.588Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「麻婆豆腐」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV15gtKeBERk",
    "platform": "bilibili",
    "recipeId": "millet-pumpkin-porridge",
    "title": "熬粥，最怕熬成一锅稀饭，没有粘稠度没有悬浮感，老师傅教你小米南瓜粥的做法~",
    "author": "品诺美食开课啦",
    "authorId": "352637817",
    "url": "https://www.bilibili.com/video/BV15gtKeBERk",
    "platformVideoId": "BV15gtKeBERk",
    "durationSec": 174,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/66353c0991e368f07f3b1e3c491163fb9747e6d9.jpg",
    "publishedAt": "2024-09-19T10:10:00.000Z",
    "stats": {
      "view": 251999,
      "like": 9918
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:01.189Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「小米南瓜粥」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1FjQgYeEc6",
    "platform": "bilibili",
    "recipeId": "oat-milk-porridge",
    "title": "口感丰富又营养的谷物燕麦牛奶粥，不用浸泡豆子，不用看火，直接用电饭锅煮，软糯可口，大人孩子孩子都爱吃#小喵麻麻甜品 #杂粮粥#电饭煲",
    "author": "小喵麻麻来了",
    "authorId": "2128112820",
    "url": "https://www.bilibili.com/video/BV1FjQgYeEc6",
    "platformVideoId": "BV1FjQgYeEc6",
    "durationSec": 147,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/4213314a212878e2ab745b736e4ba4615f58f75c.jpg",
    "publishedAt": "2025-03-14T01:38:16.000Z",
    "stats": {
      "view": 12607,
      "like": 842
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:02.747Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「燕麦牛奶粥」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV12Ucvz8EFv",
    "platform": "bilibili",
    "recipeId": "oyster-sauce-lettuce",
    "title": "蚝油生菜",
    "author": "小鹏教做菜",
    "authorId": "1695227461",
    "url": "https://www.bilibili.com/video/BV12Ucvz8EFv",
    "platformVideoId": "BV12Ucvz8EFv",
    "durationSec": 139,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/4d8fa2a4e9224cb5c8e0e5b996b61c3a4407a956.jpg",
    "publishedAt": "2026-02-12T08:40:51.000Z",
    "stats": {
      "view": 1126,
      "like": 15
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:04.312Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「蚝油生菜」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1CR4y167GP",
    "platform": "bilibili",
    "recipeId": "pan-seared-salmon",
    "title": "香煎三文鱼",
    "author": "小铁日食记",
    "authorId": "10549994",
    "url": "https://www.bilibili.com/video/BV1CR4y167GP",
    "platformVideoId": "BV1CR4y167GP",
    "durationSec": 60,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/6f574167d40e28f47a6d0175c55118b58965a5dd.jpg",
    "publishedAt": "2022-12-23T03:25:52.000Z",
    "stats": {
      "view": 55593,
      "like": 947
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:06.055Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「香煎三文鱼」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1Wsem6cExe",
    "platform": "bilibili",
    "recipeId": "potato-rib-stew",
    "title": "土豆炖排骨保姆级教程",
    "author": "大庆是个厨",
    "authorId": "1376187314",
    "url": "https://www.bilibili.com/video/BV1Wsem6cExe",
    "platformVideoId": "BV1Wsem6cExe",
    "durationSec": 324,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/a56f722d9b2a02088341e921c8d4dc3e3aea85f2.jpg",
    "publishedAt": "2026-09-18T10:57:33.000Z",
    "stats": {
      "view": 7467,
      "like": 352
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:05.923Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「土豆炖排骨」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1rnQ2YiEKE",
    "platform": "bilibili",
    "recipeId": "scallion-oil-noodles",
    "title": "教程丨厨者王波·认真做菜 葱油拌面！全网最详细教程！毫无保留，拿去开店都ok！真正在家也能实现葱油拌面自由啦！",
    "author": "厨者王波",
    "authorId": "3546728118618546",
    "url": "https://www.bilibili.com/video/BV1rnQ2YiEKE",
    "platformVideoId": "BV1rnQ2YiEKE",
    "durationSec": 409,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/d5000a16fb0256d41b5bb0b5cbc2a038b970a9f7.jpg",
    "publishedAt": "2025-03-15T08:28:57.000Z",
    "stats": {
      "view": 133842,
      "like": 4808
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:07.640Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「葱油拌面」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1oytPeiE8N",
    "platform": "bilibili",
    "recipeId": "steamed-seabass",
    "title": "为啥广东人做的清蒸鲈鱼那么好吃？大厨教你正确做法，鲜嫩无腥味",
    "author": "天天相见厨房阿鹏",
    "authorId": "1677299710",
    "url": "https://www.bilibili.com/video/BV1oytPeiE8N",
    "platformVideoId": "BV1oytPeiE8N",
    "durationSec": 482,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/bff022a660f40d08204564ab7942ee5ddd9ae059.jpg",
    "publishedAt": "2024-09-14T10:00:00.000Z",
    "stats": {
      "view": 489643,
      "like": 5906
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:09.231Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「清蒸鲈鱼」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1eT4y1o7Yv",
    "platform": "bilibili",
    "recipeId": "teriyaki-chicken-rice",
    "title": "【保姆级教程】如何做出超越吉野家的照烧鸡腿饭？",
    "author": "简简厨房",
    "authorId": "1610203585",
    "url": "https://www.bilibili.com/video/BV1eT4y1o7Yv",
    "platformVideoId": "BV1eT4y1o7Yv",
    "durationSec": 674,
    "coverUrl": "https://i2.hdslb.com/bfs/archive/01e7e4a5ec3268df201500c9e43bff9e0cebc71d.jpg",
    "publishedAt": "2021-10-21T11:08:07.000Z",
    "stats": {
      "view": 584775,
      "like": 21968
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:10.773Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「照烧鸡腿饭」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1nr4y1W724",
    "platform": "bilibili",
    "recipeId": "three-fresh-dumplings",
    "title": "素三鲜水饺 一口邂逅虾 再口喜家得 接着会想家",
    "author": "xiaoyu小魚来了",
    "authorId": "486974664",
    "url": "https://www.bilibili.com/video/BV1nr4y1W724",
    "platformVideoId": "BV1nr4y1W724",
    "durationSec": 352,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/60db0093804b1ea4325b92c5f541a7a7ddb50609.jpg",
    "publishedAt": "2022-03-25T11:53:46.000Z",
    "stats": {
      "view": 4125,
      "like": 80
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:12.329Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「三鲜水饺」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1AmamzBEvy",
    "platform": "bilibili",
    "recipeId": "tomato-beef-brisket",
    "title": "全程不加一滴水！番茄牛腩保姆级超详细教程",
    "author": "袁锐-萌新的圆",
    "authorId": "48474560",
    "url": "https://www.bilibili.com/video/BV1AmamzBEvy",
    "platformVideoId": "BV1AmamzBEvy",
    "durationSec": 290,
    "coverUrl": "https://i2.hdslb.com/bfs/archive/6caffed65ff41ee861d41f880a89f00c71b19b1c.jpg",
    "publishedAt": "2025-09-04T08:58:55.000Z",
    "stats": {
      "view": 449697,
      "like": 11464
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:13.883Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「番茄牛腩」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1YFuR6PEYh",
    "platform": "bilibili",
    "recipeId": "tomato-beef-noodle",
    "title": "随便吃个番茄牛肉面",
    "author": "想长胖滴小猪猪",
    "authorId": "3546960852158871",
    "url": "https://www.bilibili.com/video/BV1YFuR6PEYh",
    "platformVideoId": "BV1YFuR6PEYh",
    "durationSec": 204,
    "coverUrl": "https://i2.hdslb.com/bfs/archive/28b5071be2b45656b6ded190c08eddb3860aa8d0.jpg",
    "publishedAt": "2026-08-10T08:00:00.000Z",
    "stats": {
      "view": 554554,
      "like": 21198
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:15.479Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「番茄牛肉面」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1yTn36fEXd",
    "platform": "bilibili",
    "recipeId": "tomato-scrambled-egg",
    "title": "番茄炒蛋",
    "author": "番茄马自达",
    "authorId": "27680333",
    "url": "https://www.bilibili.com/video/BV1yTn36fEXd",
    "platformVideoId": "BV1yTn36fEXd",
    "durationSec": 178,
    "coverUrl": "https://i0.hdslb.com/bfs/archive/6a9cea4def54ce0a337dadaaebefaec037f88d8f.jpg",
    "publishedAt": "2026-10-18T11:52:19.000Z",
    "stats": {
      "view": 39,
      "like": 1
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:27:08.304Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「番茄炒蛋」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  },
  {
    "id": "bili-BV1H34y1J7EZ",
    "platform": "bilibili",
    "recipeId": "winter-melon-meatball-soup",
    "title": "三伏天喝“冬瓜丸子汤”，不用料酒不用淀粉，丸子嫩如豆腐不松散",
    "author": "周妈妈美食",
    "authorId": "483147378",
    "url": "https://www.bilibili.com/video/BV1H34y1J7EZ",
    "platformVideoId": "BV1H34y1J7EZ",
    "durationSec": 208,
    "coverUrl": "https://i1.hdslb.com/bfs/archive/48dc614649f9618ad04514f47ddbf384b7e94c92.jpg",
    "publishedAt": "2022-07-13T10:51:53.000Z",
    "stats": {
      "view": 58232,
      "like": 1237
    },
    "verification": {
      "status": "verified",
      "checkedAt": "2026-10-19T07:28:17.040Z",
      "method": "bilibili-view-api + video-page-http",
      "matchBasis": "title-keyword",
      "note": "view 接口可访问，标题包含菜名「冬瓜丸子汤」；视频详情页 HTTP 200。相关性基于标题关键词与搜索排序，未逐帧核对做法。"
    }
  }
];
