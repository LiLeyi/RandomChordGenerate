class CustomOption extends HTMLElement {
    constructor() {
        super()
        this.value = this.getAttribute('value')
        this.index = -1
        this.render()
    }
    render(){
        this.style.cssText = "\
            white-space: nowrap;\
            text-overflow: ellipsis;\
            overflow: hidden;\
            background-color: #F3F3F4;\
            padding: 0.5vh;\
            margin-top: 2vh;\
        "
    }
}

class CustomSelect extends HTMLElement {
    constructor() {
        super()
        this.select_index = this.getAttribute('default') ?? 0
        this.is_folded = true
        this.options = []
    }
    connectedCallback(){
        let index_i = 0
        for(let child of this.children){
            if (child.tagName.toLowerCase() == 'custom-option') {
                this.options.push(child)
                child.index = index_i
                index_i += 1
            }
        }
        this.value = this.options[this.select_index].value
        this.fold()
    }    unfold() {
        this.options.forEach(option => {
            option.hidden = false
        })
        this.is_folded = false
    }
    fold() {
        this.options.forEach(option => {
            option.hidden = true
        })
        this.options[this.select_index].hidden = false
        this.is_folded = true
    }
    select(index){
        this.select_index = index
        this.value = this.options[this.select_index].value
        this.fold()
        const event = new CustomEvent('change', {
            detail: {
                value: this.value,
                index: this.select_index
            },
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(event)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 为所有自定义选择组件添加功能
    initializeCustomSelects();
    
    function initializeCustomSelects() {
        // 查找所有的自定义选择组件
        const customSelects = document.querySelectorAll('custom-select');
        
        customSelects.forEach(select => {
            // 创建选择界面元素
            const selectedOption = document.createElement('div');
            selectedOption.className = 'selected-option';
            
            // 创建选项容器
            const options = document.createElement('div');
            options.className = 'options';
            
            // 获取所有选项
            const customOptions = select.querySelectorAll('custom-option');
            
            // 设置默认选中的选项
            if (customOptions.length > 0) {
                selectedOption.textContent = customOptions[0].textContent;
                selectedOption.setAttribute('data-value', customOptions[0].getAttribute('value'));
            }
            
            // 为每个选项添加事件处理
            customOptions.forEach(option => {
                options.appendChild(option);
                
                option.addEventListener('click', function() {
                    // 更新选中项的显示
                    selectedOption.textContent = this.textContent;
                    selectedOption.setAttribute('data-value', this.getAttribute('value'));
                    
                    // 关闭选项列表
                    select.classList.remove('open');
                    
                    // 触发change事件
                    const event = new Event('change');
                    select.dispatchEvent(event);
                    
                    // 隐藏/显示相应的内容面板
                    handleModeChange(this.getAttribute('value'));
                });
            });
            
            // 添加到DOM
            select.appendChild(selectedOption);
            select.appendChild(options);
            
            // 点击选择框时打开/关闭选项列表
            selectedOption.addEventListener('click', function(e) {
                e.stopPropagation();
                select.classList.toggle('open');
                
                // 关闭其他所有的选择框
                customSelects.forEach(otherSelect => {
                    if (otherSelect !== select) {
                        otherSelect.classList.remove('open');
                    }
                });
            });
        });
        
        // 点击外部区域时关闭所有选择框
        document.addEventListener('click', function() {
            customSelects.forEach(select => {
                select.classList.remove('open');
            });
        });
        
        // 初始显示第一个模式面板
        const firstSelect = document.querySelector('custom-select');
        if (firstSelect) {
            const selectedValue = firstSelect.querySelector('.selected-option').getAttribute('data-value');
            handleModeChange(selectedValue);
        }
    }
    
    // 处理模式切换，显示相应的面板
    function handleModeChange(mode) {
        // 隐藏所有模式面板
        const modePanels = document.querySelectorAll('.mode-panel');
        modePanels.forEach(panel => {
            panel.style.display = 'none';
        });
        
        // 显示选中的模式面板
        const selectedPanel = document.getElementById(`mode_${mode}`);
        if (selectedPanel) {
            selectedPanel.style.display = 'block';
        }
    }
    
    // 为自定义选择组件添加getValue方法
    HTMLElement.prototype.getValue = function() {
        if (this.tagName.toLowerCase() === 'custom-select') {
            const selectedOption = this.querySelector('.selected-option');
            if (selectedOption) {
                return selectedOption.getAttribute('data-value');
            }
        }
        return null;
    };
});

window.customElements.define('custom-option', CustomOption)
window.customElements.define('custom-select', CustomSelect)