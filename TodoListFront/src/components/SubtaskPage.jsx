import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Divider,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    ArrowBack,
    Add,
    Delete,
    Edit,
    CheckCircle,
    RadioButtonUnchecked,
    Flag,
    SmartToy,
    Lightbulb,
    TrendingUp,
    Schedule,
    School,
    Work,
    Psychology,
    Timeline
} from '@mui/icons-material';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';

const SubtaskPage = () => {
    const { todoId } = useParams();
    const navigate = useNavigate();
    const { todos, getSubtasks, addSubtask, updateSubtask, toggleSubtask, deleteSubtask, getSubtaskStats, subtaskStats, addTodo } = useTodo();
    const { language, t } = useLanguage();

    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [editingSubtask, setEditingSubtask] = useState(null);
    const [newSubtask, setNewSubtask] = useState({
        value: '',
        priority: 'MEDIUM'
    });

    // Agent相关状态
    const [openAgentDialog, setOpenAgentDialog] = useState(false);
    const [agentLoading, setAgentLoading] = useState(false);
    const [agentError, setAgentError] = useState(null);
    const [agentSuggestions, setAgentSuggestions] = useState({
        reprioritizedSubtasks: [],
        recommendedTodos: [],
        strategicSuggestions: [],
        contextAdvice: {
            taskType: 'OTHER',
            generalTips: [],
            timeline: '',
            resources: []
        }
    });
    const [additionalConditions, setAdditionalConditions] = useState('');

    // Find current task
    const currentTodo = todos.find(todo => todo.id === parseInt(todoId));
    const stats = subtaskStats[parseInt(todoId)];

    useEffect(() => {
        loadSubtasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todoId]);

    const loadSubtasks = async () => {
        try {
            setLoading(true);
            const data = await getSubtasks(parseInt(todoId));
            setSubtasks(data);
            await getSubtaskStats(parseInt(todoId));
        } catch (error) {
            console.error('Error loading subtasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubtask = async () => {
        try {
            await addSubtask(parseInt(todoId), newSubtask);
            setNewSubtask({ value: '', priority: 'MEDIUM' });
            setOpenAddDialog(false);
            await loadSubtasks();
        } catch (error) {
            console.error('Error adding subtask:', error);
            // 临时显示错误信息
            alert('子任务功能暂时不可用，请稍后再试。错误信息：' + error.message);
        }
    };

    const handleUpdateSubtask = async () => {
        try {
            await updateSubtask(editingSubtask.id, editingSubtask);
            setEditingSubtask(null);
            await loadSubtasks();
        } catch (error) {
            console.error('Error updating subtask:', error);
            alert('更新子任务失败，请稍后再试。错误信息：' + error.message);
        }
    };

    const handleToggleSubtask = async (subtask) => {
        try {
            await toggleSubtask(subtask.id, parseInt(todoId));
            await loadSubtasks();
        } catch (error) {
            console.error('Error toggling subtask:', error);
            alert('切换子任务状态失败，请稍后再试。错误信息：' + error.message);
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            await deleteSubtask(subtaskId);
            await loadSubtasks();
        } catch (error) {
            console.error('Error deleting subtask:', error);
            alert('删除子任务失败，请稍后再试。错误信息：' + error.message);
        }
    };

    // Agent功能：重新规划优先级和推荐待办事项
    const handleAgentAnalysis = async () => {
        try {
            setAgentLoading(true);
            setAgentError(null);
            
            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error(language === 'zh' 
                    ? 'OpenAI API密钥未配置' 
                    : 'OpenAI API key is not configured');
            }

            // 准备当前任务和子任务信息
            const currentTaskInfo = {
                mainTask: currentTodo.text[language],
                subtasks: subtasks.map(st => ({
                    id: st.id,
                    content: st.value,
                    priority: st.priority,
                    completed: st.completed
                })),
                allTodos: todos.map(t => ({
                    id: t.id,
                    content: t.text[language],
                    completed: t.completed
                })),
                additionalConditions: additionalConditions.trim()
            };

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "system",
                        content: `You are a comprehensive productivity AI agent that helps optimize task management and provides strategic advice. Analyze the current task and its subtasks, then provide:

1. Reprioritized subtasks based on importance and urgency
2. Recommended additional subtasks that would complement the current work (these should be added as subtasks to the current task, not as separate main tasks)
3. Strategic suggestions for task completion and improvement
4. Context-specific advice based on the task type (e.g., interview preparation, project planning, learning, etc.)

Consider any additional conditions or constraints provided by the user when making recommendations.

Return only a JSON object with this structure:
{
  "reprioritizedSubtasks": [
    {"id": 1, "newPriority": "HIGH", "reason": "explanation"}
  ],
  "recommendedTodos": [
    {"content": "subtask description", "priority": "HIGH", "reason": "why this subtask is recommended"}
  ],
  "strategicSuggestions": [
    {"type": "PREPARATION", "title": "suggestion title", "description": "detailed suggestion", "priority": "HIGH"}
  ],
  "contextAdvice": {
    "taskType": "INTERVIEW|PROJECT|LEARNING|OTHER",
    "generalTips": ["tip1", "tip2", "tip3"],
    "timeline": "suggested timeline",
    "resources": ["resource1", "resource2"]
  }
}`
                    }, {
                        role: "user",
                        content: JSON.stringify(currentTaskInfo)
                    }],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(language === 'zh'
                    ? `AI分析失败: ${errorData.error?.message || '未知错误'}`
                    : `AI analysis failed: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            if (!data.choices?.[0]?.message?.content) {
                throw new Error(language === 'zh'
                    ? 'AI返回格式无效'
                    : 'Invalid AI response format');
            }

            try {
                const suggestions = JSON.parse(data.choices[0].message.content);
                setAgentSuggestions(suggestions);
                setOpenAgentDialog(true);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                throw new Error(language === 'zh'
                    ? '解析AI返回数据失败'
                    : 'Failed to parse AI response');
            }
            
        } catch (error) {
            console.error('Agent analysis error:', error);
            setAgentError(error.message);
        } finally {
            setAgentLoading(false);
        }
    };

    // 应用重新规划的优先级
    const applyReprioritization = async () => {
        try {
            for (const suggestion of agentSuggestions.reprioritizedSubtasks) {
                const subtask = subtasks.find(st => st.id === suggestion.id);
                if (subtask && subtask.priority !== suggestion.newPriority) {
                    await updateSubtask(subtask.id, {
                        ...subtask,
                        priority: suggestion.newPriority
                    });
                }
            }
            await loadSubtasks();
            setOpenAgentDialog(false);
        } catch (error) {
            console.error('Error applying reprioritization:', error);
            alert(language === 'zh' ? '应用优先级调整失败' : 'Failed to apply priority changes');
        }
    };

    // 添加推荐的待办事项
    const addRecommendedTodo = async (todo) => {
        try {
            // 将推荐的任务添加为子任务，而不是主任务
            await addSubtask(parseInt(todoId), {
                value: todo.content,
                priority: todo.priority
            });
            
            // 从推荐列表中移除已添加的任务
            setAgentSuggestions(prev => ({
                ...prev,
                recommendedTodos: prev.recommendedTodos.filter(t => t.content !== todo.content)
            }));
            
            // 重新加载子任务列表
            await loadSubtasks();
        } catch (error) {
            console.error('Error adding recommended subtask:', error);
            alert(language === 'zh' ? '添加推荐子任务失败' : 'Failed to add recommended subtask');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'info';
            default: return 'default';
        }
    };

    const getPriorityText = (priority) => {
        const priorities = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };
        return priorities[priority] || priority;
    };

    const getProgress = () => {
        if (!stats || stats.total === 0) return 0;
        return (stats.completed / stats.total) * 100;
    };

    if (!currentTodo) {
        return (
            <Box className="min-h-screen bg-background-light dark:bg-background-dark p-4">
                <Typography variant="h6" className="text-center text-gray-500">
                    Task not found
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <Box className="sticky top-0 z-10 bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-700">
                <Box className="flex items-center justify-between p-4 max-w-4xl mx-auto">
                    <Box className="flex items-center gap-3">
                        <IconButton
                            onClick={() => navigate('/')}
                            className="text-gray-600 dark:text-gray-400"
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h6" className="font-semibold">
                                {currentTodo.text[language]}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                Subtask Management
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddDialog(true)}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Add Subtask
                    </Button>
                    
                    {/* AI Agent Button */}
                    <Button
                        variant="outlined"
                        startIcon={agentLoading ? <CircularProgress size={18} /> : <SmartToy />}
                        onClick={() => setOpenAgentDialog(true)}
                        disabled={agentLoading || subtasks.length === 0}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: 'rgba(0, 122, 255, 0.3)',
                            color: '#007AFF',
                            '&:hover': {
                                borderColor: '#007AFF',
                                backgroundColor: 'rgba(0, 122, 255, 0.05)',
                            },
                            '&:disabled': {
                                borderColor: 'rgba(142, 142, 147, 0.3)',
                                color: '#8E8E93'
                            }
                        }}
                    >
                        {agentLoading 
                            ? (language === 'zh' ? '分析中...' : 'Analyzing...') 
                            : (language === 'zh' ? 'AI 智能规划' : 'AI Smart Planning')}
                    </Button>
                </Box>

                {/* Progress bar */}
                {stats && stats.total > 0 && (
                    <Box className="px-4 pb-4">
                        <Box className="flex justify-between items-center mb-2">
                            <Typography variant="body2" className="text-gray-600">
                                Progress
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                                {stats.completed}/{stats.total} ({Math.round(getProgress())}%)
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={getProgress()}
                            className="h-2 rounded-full"
                            sx={{
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                '.MuiLinearProgress-bar': {
                                    borderRadius: '9999px',
                                    background: 'linear-gradient(90deg, #007AFF, #00C6FF)'
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* Content area */}
            <Box className="max-w-4xl mx-auto p-4">
                {loading ? (
                    <Box className="text-center py-8">
                        <Typography>Loading...</Typography>
                    </Box>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {subtasks.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <Typography variant="h6" className="text-gray-500 mb-4">
                                    No subtasks yet
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() => setOpenAddDialog(true)}
                                >
                                    Create your first subtask
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                {subtasks.map((subtask) => (
                                    <motion.div
                                        key={subtask.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <Card className="hover:shadow-md transition-shadow duration-200">
                                            <CardContent className="p-4">
                                                <Box className="flex items-center justify-between">
                                                    <Box className="flex items-center gap-3 flex-1">
                                                        <Checkbox
                                                            checked={subtask.completed}
                                                            onChange={() => handleToggleSubtask(subtask)}
                                                            icon={<RadioButtonUnchecked />}
                                                            checkedIcon={<CheckCircle />}
                                                            className="text-blue-500"
                                                        />
                                                        <Box className="flex-1">
                                                            <Typography
                                                                className={`${
                                                                    subtask.completed ? 'line-through text-gray-400' : ''
                                                                } transition-colors duration-200`}
                                                            >
                                                                {subtask.value}
                                                            </Typography>
                                                            <Box className="flex items-center gap-2 mt-1">
                                                                <Chip
                                                                    size="small"
                                                                    icon={<Flag fontSize="small" />}
                                                                    label={getPriorityText(subtask.priority)}
                                                                    color={getPriorityColor(subtask.priority)}
                                                                    variant="outlined"
                                                                />
                                                                {subtask.completed && (
                                                                    <Chip
                                                                        size="small"
                                                                        label="Completed"
                                                                        color="success"
                                                                        variant="filled"
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Box className="flex items-center gap-1">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setEditingSubtask({ ...subtask })}
                                                            className="text-gray-400 hover:text-blue-500"
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteSubtask(subtask.id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </Box>

            {/* Add subtask dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Subtask</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subtask Content"
                        fullWidth
                        variant="outlined"
                        value={newSubtask.value}
                        onChange={(e) => setNewSubtask(prev => ({ ...prev, value: e.target.value }))}
                        className="mb-4"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={newSubtask.priority}
                            label="Priority"
                            onChange={(e) => setNewSubtask(prev => ({ ...prev, priority: e.target.value }))}
                        >
                            <MenuItem value="HIGH">High Priority</MenuItem>
                            <MenuItem value="MEDIUM">Medium Priority</MenuItem>
                            <MenuItem value="LOW">Low Priority</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddSubtask}
                        variant="contained"
                        disabled={!newSubtask.value.trim()}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit subtask dialog */}
            <Dialog
                open={!!editingSubtask}
                onClose={() => setEditingSubtask(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Subtask</DialogTitle>
                <DialogContent>
                    {editingSubtask && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Subtask Content"
                                fullWidth
                                variant="outlined"
                                value={editingSubtask.value}
                                onChange={(e) => setEditingSubtask(prev => ({ ...prev, value: e.target.value }))}
                                className="mb-4"
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={editingSubtask.priority}
                                    label="Priority"
                                    onChange={(e) => setEditingSubtask(prev => ({ ...prev, priority: e.target.value }))}
                                >
                                    <MenuItem value="HIGH">High Priority</MenuItem>
                                    <MenuItem value="MEDIUM">Medium Priority</MenuItem>
                                    <MenuItem value="LOW">Low Priority</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingSubtask(null)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateSubtask}
                        variant="contained"
                        disabled={!editingSubtask?.value.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* AI Agent Dialog */}
            <Dialog
                open={openAgentDialog}
                onClose={() => setOpenAgentDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle className="flex items-center gap-2">
                    <SmartToy className="text-blue-500" />
                    {language === 'zh' ? 'AI 智能规划建议' : 'AI Smart Planning Suggestions'}
                </DialogTitle>
                <DialogContent>
                    <Box className="space-y-6">
                        {/* 额外条件输入框 - 只在分析前显示 */}
                        {!agentSuggestions.reprioritizedSubtasks.length && !agentSuggestions.recommendedTodos.length && (
                            <Box>
                                <Typography variant="h6" className="mb-3 flex items-center gap-2">
                                    <Schedule className="text-purple-500" />
                                    {language === 'zh' ? '额外条件' : 'Additional Conditions'}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    placeholder={
                                        language === 'zh' 
                                            ? `输入额外条件，例如：
• 面试准备：需要准备技术面试，有3天时间
• 项目规划：团队有5人，需要在2周内完成
• 学习计划：每天有2小时学习时间，目标是掌握React
• 时间限制：需要在今天下午5点前完成
• 资源约束：只有我一个人，需要简单易行的方案`
                                            : `Enter additional conditions, such as:
• Interview prep: Need to prepare for technical interview, have 3 days
• Project planning: Team of 5 people, need to complete in 2 weeks
• Learning plan: 2 hours daily study time, goal is to master React
• Time constraints: Need to complete by 5 PM today
• Resource limitations: Only me, need simple and feasible solutions`
                                    }
                                    value={additionalConditions}
                                    onChange={(e) => setAdditionalConditions(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            }
                                        }
                                    }}
                                />
                                <Typography variant="body2" className="text-gray-500 mt-2">
                                    {language === 'zh' 
                                        ? '这些条件将帮助AI更好地理解您的需求，提供更精准的建议。AI会推荐相关的子任务、调整优先级，并提供战略建议。' 
                                        : 'These conditions will help AI better understand your needs and provide more accurate suggestions. AI will recommend related subtasks, adjust priorities, and provide strategic advice.'}
                                </Typography>
                            </Box>
                        )}

                        {/* 重新规划的优先级 */}
                        {agentSuggestions.reprioritizedSubtasks.length > 0 && (
                            <Box>
                                <Typography variant="h6" className="mb-3 flex items-center gap-2">
                                    <TrendingUp className="text-green-500" />
                                    {language === 'zh' ? '优先级调整建议' : 'Priority Adjustment Suggestions'}
                                </Typography>
                                <List className="bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-2">
                                    {agentSuggestions.reprioritizedSubtasks.map((suggestion, index) => {
                                        const subtask = subtasks.find(st => st.id === suggestion.id);
                                        return (
                                            <ListItem key={index} className="mb-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                                                <ListItemIcon>
                                                    <Chip
                                                        size="small"
                                                        label={suggestion.newPriority}
                                                        color={getPriorityColor(suggestion.newPriority)}
                                                        variant="filled"
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={subtask?.value || `Subtask ${suggestion.id}`}
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                                                {language === 'zh' ? '原优先级' : 'Original'}: {subtask?.priority}
                                                            </Typography>
                                                            <Typography variant="body2" className="text-blue-600 dark:text-blue-400 mt-1">
                                                                {suggestion.reason}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>
                        )}

                        {/* 推荐的待办事项 */}
                        {agentSuggestions.recommendedTodos.length > 0 && (
                            <Box>
                                <Typography variant="h6" className="mb-3 flex items-center gap-2">
                                    <Lightbulb className="text-yellow-500" />
                                    {language === 'zh' ? '推荐的子任务' : 'Recommended Subtasks'}
                                </Typography>
                                <List className="bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-2">
                                    {agentSuggestions.recommendedTodos.map((todo, index) => (
                                        <ListItem key={index} className="mb-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                                            <ListItemIcon>
                                                <Chip
                                                    size="small"
                                                    label={todo.priority}
                                                    color={getPriorityColor(todo.priority)}
                                                    variant="outlined"
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={todo.content}
                                                secondary={
                                                    <Typography variant="body2" className="text-blue-600 dark:text-blue-400 mt-1">
                                                        {todo.reason}
                                                    </Typography>
                                                }
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => addRecommendedTodo(todo)}
                                                sx={{
                                                    color: '#34C759',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                                                    }
                                                }}
                                                title={language === 'zh' ? '添加为子任务' : 'Add as subtask'}
                                            >
                                                <Add />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* 战略建议 */}
                        {agentSuggestions.strategicSuggestions.length > 0 && (
                            <Box>
                                <Typography variant="h6" className="mb-3 flex items-center gap-2">
                                    <TrendingUp className="text-purple-500" />
                                    {language === 'zh' ? '战略建议' : 'Strategic Suggestions'}
                                </Typography>
                                <List className="bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-2">
                                    {agentSuggestions.strategicSuggestions.map((suggestion, index) => (
                                        <ListItem key={index} className="mb-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                                            <ListItemIcon>
                                                <Chip
                                                    size="small"
                                                    label={suggestion.priority}
                                                    color={getPriorityColor(suggestion.priority)}
                                                    variant="filled"
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={suggestion.title}
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                                            {language === 'zh' ? '优先级' : 'Priority'}: {suggestion.priority}
                                                        </Typography>
                                                        <Typography variant="body2" className="text-blue-600 dark:text-blue-400 mt-1">
                                                            {suggestion.description}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* 上下文建议 */}
                        {agentSuggestions.contextAdvice && agentSuggestions.contextAdvice.taskType !== 'OTHER' && (
                            <Box>
                                <Typography variant="h6" className="mb-3 flex items-center gap-2">
                                    {agentSuggestions.contextAdvice.taskType === 'INTERVIEW' && <Work className="text-blue-500" />}
                                    {agentSuggestions.contextAdvice.taskType === 'PROJECT' && <TrendingUp className="text-green-500" />}
                                    {agentSuggestions.contextAdvice.taskType === 'LEARNING' && <School className="text-purple-500" />}
                                    {agentSuggestions.contextAdvice.taskType === 'OTHER' && <Psychology className="text-orange-500" />}
                                    {language === 'zh' ? '智能建议' : 'Smart Advice'}
                                </Typography>
                                
                                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/30">
                                    <CardContent className="p-4">
                                        {/* 任务类型 */}
                                        <Box className="mb-4">
                                            <Typography variant="subtitle1" className="font-semibold text-gray-900 dark:text-white mb-2">
                                                {language === 'zh' ? '任务类型识别' : 'Task Type Identified'}
                                            </Typography>
                                            <Chip
                                                label={
                                                    agentSuggestions.contextAdvice.taskType === 'INTERVIEW' ? (language === 'zh' ? '面试准备' : 'Interview Preparation') :
                                                    agentSuggestions.contextAdvice.taskType === 'PROJECT' ? (language === 'zh' ? '项目管理' : 'Project Management') :
                                                    agentSuggestions.contextAdvice.taskType === 'LEARNING' ? (language === 'zh' ? '学习计划' : 'Learning Plan') :
                                                    (language === 'zh' ? '其他任务' : 'Other Task')
                                                }
                                                color="primary"
                                                variant="filled"
                                                icon={
                                                    agentSuggestions.contextAdvice.taskType === 'INTERVIEW' ? <Work /> :
                                                    agentSuggestions.contextAdvice.taskType === 'PROJECT' ? <TrendingUp /> :
                                                    agentSuggestions.contextAdvice.taskType === 'LEARNING' ? <School /> :
                                                    <Psychology />
                                                }
                                            />
                                        </Box>

                                        {/* 通用建议 */}
                                        {agentSuggestions.contextAdvice.generalTips.length > 0 && (
                                            <Box className="mb-4">
                                                <Typography variant="subtitle1" className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                    <Lightbulb className="text-yellow-500" />
                                                    {language === 'zh' ? '通用建议' : 'General Tips'}
                                                </Typography>
                                                <List dense>
                                                    {agentSuggestions.contextAdvice.generalTips.map((tip, index) => (
                                                        <ListItem key={index} className="px-0">
                                                            <ListItemIcon className="min-w-0 mr-2">
                                                                <Box className="w-2 h-2 bg-blue-500 rounded-full" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={tip}
                                                                className="text-gray-700 dark:text-gray-300"
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}

                                        {/* 时间线建议 */}
                                        {agentSuggestions.contextAdvice.timeline && (
                                            <Box className="mb-4">
                                                <Typography variant="subtitle1" className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                    <Timeline className="text-green-500" />
                                                    {language === 'zh' ? '建议时间线' : 'Suggested Timeline'}
                                                </Typography>
                                                <Typography variant="body2" className="text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                    {agentSuggestions.contextAdvice.timeline}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* 推荐资源 */}
                                        {agentSuggestions.contextAdvice.resources.length > 0 && (
                                            <Box>
                                                <Typography variant="subtitle1" className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                    <School className="text-purple-500" />
                                                    {language === 'zh' ? '推荐资源' : 'Recommended Resources'}
                                                </Typography>
                                                <List dense>
                                                    {agentSuggestions.contextAdvice.resources.map((resource, index) => (
                                                        <ListItem key={index} className="px-0">
                                                            <ListItemIcon className="min-w-0 mr-2">
                                                                <Box className="w-2 h-2 bg-purple-500 rounded-full" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={resource}
                                                                className="text-gray-700 dark:text-gray-300"
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        )}

                        {/* 错误显示 */}
                        {agentError && (
                            <Alert severity="error" className="mt-4">
                                {agentError}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAgentDialog(false)}>
                        {language === 'zh' ? '关闭' : 'Close'}
                    </Button>
                    
                    {/* 分析按钮 */}
                    <Button
                        onClick={handleAgentAnalysis}
                        variant="contained"
                        disabled={agentLoading}
                        startIcon={agentLoading ? <CircularProgress size={18} /> : <SmartToy />}
                        sx={{
                            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0056CC 0%, #4A47B8 100%)',
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #E5E5EA 0%, #D1D1D6 100%)',
                            }
                        }}
                    >
                        {agentLoading 
                            ? (language === 'zh' ? '分析中...' : 'Analyzing...') 
                            : (language === 'zh' ? '开始分析' : 'Start Analysis')}
                    </Button>
                    
                    {agentSuggestions.reprioritizedSubtasks.length > 0 && (
                        <Button
                            onClick={applyReprioritization}
                            variant="contained"
                            startIcon={<TrendingUp />}
                            sx={{
                                background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #28A745 0%, #24B33E 100%)',
                                }
                            }}
                        >
                            {language === 'zh' ? '应用优先级调整' : 'Apply Priority Changes'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SubtaskPage;