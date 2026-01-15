/*
 * @Author: Quaternijkon quaternijkon@mail.ustc.edu.cn
 * @Date: 2026-01-15 18:05:29
 * @LastEditors: Quaternijkon quaternijkon@mail.ustc.edu.cn
 * @LastEditTime: 2026-01-15 18:06:27
 * @FilePath: \undefinedd:\obsidian-gitsync\ustc_course\additional\my.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
document.addEventListener("DOMContentLoaded", function () {
  // 获取文章主体内容
  const content = document.querySelector(".content main");

  if (content) {
    // 使用 TreeWalker 遍历所有文本节点，避免破坏 HTML 结构（如链接内部）
    // 这里的正则匹配 # 开头，后跟中文、字母、数字或下划线
    const regex = /#([\w\u4e00-\u9fa5]+)/g;

    let walker = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    let nodesToReplace = [];

    while ((node = walker.nextNode())) {
      // 忽略代码块中的文本 (code 和 pre 标签)
      if (
        node.parentElement.tagName === "CODE" ||
        node.parentElement.tagName === "PRE"
      ) {
        continue;
      }

      if (node.nodeValue.match(regex)) {
        nodesToReplace.push(node);
      }
    }

    // 执行替换
    nodesToReplace.forEach((node) => {
      const fragment = document.createDocumentFragment();
      let lastIdx = 0;
      node.nodeValue.replace(regex, (match, tagName, offset) => {
        // 添加匹配前的纯文本
        fragment.appendChild(
          document.createTextNode(node.nodeValue.substring(lastIdx, offset))
        );

        // 创建标签元素
        const span = document.createElement("span");
        span.className = "md-tag";
        span.textContent = match; // 保留 # 号，如果不想保留可以用 tagName
        fragment.appendChild(span);

        lastIdx = offset + match.length;
        return match;
      });

      // 添加剩余的文本
      fragment.appendChild(
        document.createTextNode(node.nodeValue.substring(lastIdx))
      );
      node.parentNode.replaceChild(fragment, node);
    });
  }
});
