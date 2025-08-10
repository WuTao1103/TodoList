package com.example.todolist.enums;

/**
 * 任务优先级枚举
 */
public enum Priority {
    /**
     * 低优先级
     */
    LOW(1, "低", "Low"),

    /**
     * 中等优先级
     */
    MEDIUM(2, "中", "Medium"),

    /**
     * 高优先级
     */
    HIGH(3, "高", "High"),

    /**
     * 紧急优先级
     */
    URGENT(4, "紧急", "Urgent");

    private final int level;
    private final String zhName;
    private final String enName;

    Priority(int level, String zhName, String enName) {
        this.level = level;
        this.zhName = zhName;
        this.enName = enName;
    }

    public int getLevel() {
        return level;
    }

    public String getZhName() {
        return zhName;
    }

    public String getEnName() {
        return enName;
    }

    /**
     * 根据优先级等级获取枚举
     * @param level 优先级等级
     * @return 优先级枚举
     */
    public static Priority fromLevel(int level) {
        for (Priority priority : Priority.values()) {
            if (priority.level == level) {
                return priority;
            }
        }
        return MEDIUM; // 默认中等优先级
    }

    /**
     * 获取显示名称（根据语言）
     * @param language 语言代码 (zh/en)
     * @return 显示名称
     */
    public String getDisplayName(String language) {
        return "zh".equals(language) ? zhName : enName;
    }
}