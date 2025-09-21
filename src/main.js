class MobileSudokuTetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.piecesContainer = document.getElementById('piecesContainer');
        
        this.BOARD_SIZE = 9;
        this.CELL_SIZE = 40; // Увеличенный размер для лучшей видимости
        
        // Устанавливаем размер canvas
        this.canvas.width = this.BOARD_SIZE * this.CELL_SIZE;
        this.canvas.height = this.BOARD_SIZE * this.CELL_SIZE;
        
        this.board = Array(this.BOARD_SIZE).fill().map(() => Array(this.BOARD_SIZE).fill(0));
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = true;
        this.record = this.loadRecord();
        
        // Состояние перетаскивания
        this.draggedPiece = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchMoved = false;
        this.isTouchDragging = false;
        this.TOUCH_LIFT_BASE = this.CELL_SIZE * 0.85;
        this.MIN_TOUCH_LIFT = this.CELL_SIZE * 0.3;
        this.touchLiftOffset = this.TOUCH_LIFT_BASE;
        
        // Состояние выбранной фигуры
        this.selectedPiece = null;
        this.selectedPieceElement = null;
        
        // Разнообразные фигуры
        this.tetrisPieces = [
            // Классические фигуры тетриса
            {
                id: 'I',
                name: 'Линия',
                shape: [[1, 1, 1, 1]],
                color: '#e53e3e',
                size: 4
            },
            {
                id: 'O',
                name: 'Квадрат',
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#38a169',
                size: 2
            },
            {
                id: 'T',
                name: 'Т-образная',
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#3182ce',
                size: 3
            },
            {
                id: 'S',
                name: 'S-образная',
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#d69e2e',
                size: 3
            },
            {
                id: 'Z',
                name: 'Z-образная',
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#805ad5',
                size: 3
            },
            {
                id: 'J',
                name: 'J-образная',
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#dd6b20',
                size: 3
            },
            {
                id: 'L',
                name: 'L-образная',
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#38b2ac',
                size: 3
            },
            // Дополнительные фигуры
            {
                id: 'CROSS',
                name: 'Крест',
                shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ],
                color: '#9f7aea',
                size: 3
            },
            {
                id: 'CORNER',
                name: 'Уголок',
                shape: [
                    [1, 1],
                    [1, 0]
                ],
                color: '#ed8936',
                size: 2
            },
            {
                id: 'LINE3',
                name: 'Тройка',
                shape: [[1, 1, 1]],
                color: '#48bb78',
                size: 3
            },
            {
                id: 'LINE2',
                name: 'Двойка',
                shape: [[1, 1]],
                color: '#4299e1',
                size: 2
            },
            {
                id: 'DOT',
                name: 'Точка',
                shape: [[1]],
                color: '#f56565',
                size: 1
            },
            {
                id: 'LONG',
                name: 'Длинная',
                shape: [[1, 1, 1, 1, 1]],
                color: '#68d391',
                size: 5
            },
            {
                id: 'STAIRS',
                name: 'Лестница',
                shape: [
                    [1, 0, 0],
                    [1, 1, 0],
                    [1, 1, 1]
                ],
                color: '#4fd1c7',
                size: 3
            },
            {
                id: 'SMALLT',
                name: 'Маленькая Т',
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#f6ad55',
                size: 3
            },
            {
                id: 'PLUS',
                name: 'Плюс',
                shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ],
                color: '#9f7aea',
                size: 3
            },
            {
                id: 'L_SHAPE',
                name: 'L-форма',
                shape: [
                    [1, 0],
                    [1, 0],
                    [1, 1]
                ],
                color: '#38b2ac',
                size: 3
            },
            {
                id: 'LINE4',
                name: 'Четверка',
                shape: [[1, 1, 1, 1]],
                color: '#48bb78',
                size: 4
            },
            {
                id: 'CORNER3',
                name: 'Уголок 3',
                shape: [
                    [1, 1],
                    [1, 0],
                    [1, 0]
                ],
                color: '#ed8936',
                size: 3
            },
            {
                id: 'ZIGZAG',
                name: 'Зигзаг',
                shape: [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 1]
                ],
                color: '#805ad5',
                size: 3
            },
            {
                id: 'HOOK',
                name: 'Крючок',
                shape: [
                    [1, 1],
                    [1, 0],
                    [1, 1]
                ],
                color: '#dd6b20',
                size: 3
            },
            {
                id: 'DIAMOND',
                name: 'Ромб',
                shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ],
                color: '#38a169',
                size: 3
            },
            {
                id: 'CROSS2',
                name: 'Крест 2',
                shape: [
                    [1, 0, 1],
                    [0, 1, 0],
                    [1, 0, 1]
                ],
                color: '#3182ce',
                size: 3
            },
            {
                id: 'LONG4',
                name: 'Длинная 4',
                shape: [[1, 1, 1, 1]],
                color: '#d69e2e',
                size: 4
            },
            {
                id: 'BLOCK',
                name: 'Блок',
                shape: [
                    [1, 1],
                    [1, 1],
                    [1, 0]
                ],
                color: '#f56565',
                size: 3
            }
        ];
        
        this.availablePieces = [];
        
        // Комплименты для жены
        this.compliments = [
            "Ты самая красивая жена на свете! 💕",
            "Твоя улыбка делает мой день лучше! 😊",
            "Ты невероятно умная и талантливая! 🧠✨",
            "С тобой каждый день - это праздник! 🎉",
            "Ты моя самая любимая и дорогая! 💖",
            "Твоя доброта согревает мое сердце! ❤️",
            "Ты самая лучшая мама и жена! 👩‍👧‍👦",
            "Твоя красота завораживает! 🌟",
            "С тобой я чувствую себя самым счастливым! 😍",
            "Ты мой ангел-хранитель! 👼",
            "Твоя мудрость помогает мне во всем! 🦉",
            "Ты самая заботливая и нежная! 🤗",
            "Твоя любовь - это мой дом! 🏠💕",
            "Ты вдохновляешь меня каждый день! 💫",
            "Твоя красота не только внешняя, но и внутренняя! 🌸",
            "С тобой я могу все! 💪❤️",
            "Ты мое солнышко в пасмурный день! ☀️",
            "Твоя поддержка значит для меня все! 🤝",
            "Ты самая терпеливая и понимающая! 🙏",
            "Твоя любовь делает меня лучше! 💝"
        ];
        
        this.init();
    }
    
    // Функция для подсчета кубиков в фигуре
    countCubes(shape) {
        let count = 0;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) count++;
            }
        }
        return count;
    }
    
    // Методы для управления выбранной фигурой
    selectPiece(piece, element) {
        // Убираем выделение с предыдущей фигуры
        this.clearSelection();
        
        // Выделяем новую фигуру
        this.selectedPiece = piece;
        this.selectedPieceElement = element;
        element.classList.add('selected');
    }
    
    clearSelection() {
        if (this.selectedPieceElement) {
            this.selectedPieceElement.classList.remove('selected');
        }
        this.selectedPiece = null;
        this.selectedPieceElement = null;
    }
    
    // Функции для работы с рекордом
    loadRecord() {
        const saved = localStorage.getItem('sudokuTetrisRecord');
        return saved ? parseInt(saved) : 0;
    }
    
    saveRecord(score) {
        if (score > this.record) {
            this.record = score;
            localStorage.setItem('sudokuTetrisRecord', score.toString());
            return true; // Новый рекорд
        }
        return false;
    }
    
    // Функции для сохранения и загрузки состояния игры
    saveGameState() {
        const gameState = {
            board: this.board,
            score: this.score,
            level: this.level,
            lines: this.lines,
            availablePieces: this.availablePieces,
            gameRunning: this.gameRunning,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('sudokuTetrisGameState', JSON.stringify(gameState));
            console.log('Игра сохранена');
        } catch (error) {
            console.error('Ошибка при сохранении игры:', error);
        }
    }
    
    
    loadGameState() {
        try {
            const saved = localStorage.getItem('sudokuTetrisGameState');
            if (saved) {
                const gameState = JSON.parse(saved);
                
                // Проверяем, что сохранение не слишком старое (например, не старше 7 дней)
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
                if (Date.now() - gameState.timestamp > maxAge) {
                    console.log('Сохранение слишком старое, начинаем новую игру');
                    return false;
                }
                
                this.board = gameState.board;
                this.score = gameState.score;
                this.level = gameState.level;
                this.lines = gameState.lines;
                this.availablePieces = gameState.availablePieces;
                this.gameRunning = gameState.gameRunning;
                
                console.log('Игра загружена');
                return true;
            }
        } catch (error) {
            console.error('Ошибка при загрузке игры:', error);
        }
        return false;
    }
    
    clearGameState() {
        try {
            localStorage.removeItem('sudokuTetrisGameState');
            console.log('Сохранение игры очищено');
        } catch (error) {
            console.error('Ошибка при очистке сохранения:', error);
        }
    }
    
    // Функция для поворота фигуры на 90 градусов
    rotateShape(shape) {
        const rows = shape.length;
        const cols = shape[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = shape[i][j];
            }
        }
        
        return rotated;
    }
    
    // Функция для создания всех поворотов фигуры
    createShapeVariants(originalPiece) {
        const variants = [];
        let currentShape = originalPiece.shape;
        
        // Добавляем оригинальную фигуру
        variants.push({
            ...originalPiece,
            variant: 0,
            shape: currentShape
        });
        
        // Создаем повороты (максимум 3 поворота, чтобы избежать дубликатов)
        for (let i = 1; i < 4; i++) {
            currentShape = this.rotateShape(currentShape);
            
            // Проверяем, не является ли этот поворот идентичным оригиналу
            const isDuplicate = variants.some(variant => 
                JSON.stringify(variant.shape) === JSON.stringify(currentShape)
            );
            
            if (!isDuplicate) {
                variants.push({
                    ...originalPiece,
                    variant: i,
                    shape: currentShape,
                    name: `${originalPiece.name} (${i * 90}°)`
                });
            } else {
                break; // Если поворот дублирует существующий, прекращаем
            }
        }
        
        return variants;
    }
    
    init() {
        // Пытаемся загрузить сохраненную игру
        const gameLoaded = this.loadGameState();
        
        if (!gameLoaded) {
            // Если игра не загружена, начинаем новую
            this.generatePieces();
        } else {
            // Если игра загружена, обновляем интерфейс без анимации
            this.renderPieces(false);
        }
        
        this.draw();
        this.setupEventListeners();
        this.updateUI();
    }
    
    generatePieces() {
        this.availablePieces = [];
        const piecesToGenerate = 5; // Количество фигур на панели
        
        // Фильтруем фигуры по размеру (максимум 5 кубиков)
        const validPieces = this.tetrisPieces.filter(piece => {
            const cubeCount = this.countCubes(piece.shape);
            return cubeCount <= 5;
        });
        
        // Дополнительная проверка - оставляем только "Длинная" из 5-кубиковых
        const finalPieces = validPieces.filter(piece => {
            const cubeCount = this.countCubes(piece.shape);
            if (cubeCount === 5) {
                return piece.id === 'LONG'; // Только длинная линия
            }
            return true; // Все остальные фигуры
        });
        
        // Создаем все возможные варианты фигур с поворотами
        const allVariants = [];
        finalPieces.forEach(piece => {
            const variants = this.createShapeVariants(piece);
            allVariants.push(...variants);
        });
        
        for (let i = 0; i < piecesToGenerate; i++) {
            const randomIndex = Math.floor(Math.random() * allVariants.length);
            const piece = JSON.parse(JSON.stringify(allVariants[randomIndex]));
            piece.uniqueId = `piece_${i}_${Date.now()}`;
            this.availablePieces.push(piece);
        }
        
        this.renderPieces(true); // С анимацией для новых фигур
        
        // Проверяем условия окончания игры после генерации новых фигур
        this.checkGameOver();
    }
    
    renderPieces(animate = false) {
        this.piecesContainer.innerHTML = '';
        
        this.availablePieces.forEach((piece, index) => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'piece-item';
            pieceElement.draggable = true;
            pieceElement.dataset.pieceId = piece.uniqueId;
            
            const canvas = document.createElement('canvas');
            canvas.className = 'piece-canvas';
            canvas.width = piece.size * 20;
            canvas.height = piece.size * 20;
            
            const ctx = canvas.getContext('2d');
            this.drawPieceOnCanvas(ctx, piece, 20);
            
            pieceElement.appendChild(canvas);
            this.piecesContainer.appendChild(pieceElement);
            
            // Добавляем анимацию появления только если animate = true
            if (animate) {
                setTimeout(() => {
                    pieceElement.classList.add('appearing');
                    
                    // Убираем класс анимации после завершения
                    setTimeout(() => {
                        pieceElement.classList.remove('appearing');
                    }, 600); // Длительность анимации
                }, index * 100); // Задержка между фигурами
            }
        });
    }
    
    drawPieceOnCanvas(ctx, piece, cellSize) {
        ctx.fillStyle = piece.color;
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
                    ctx.strokeRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
                }
            }
        }
    }
    
    calculatePieceHeight(piece) {
        if (!piece || !piece.shape) {
            return 0;
        }

        let firstRow = -1;
        let lastRow = -1;

        for (let y = 0; y < piece.shape.length; y++) {
            if (piece.shape[y].some(cell => cell)) {
                if (firstRow === -1) {
                    firstRow = y;
                }
                lastRow = y;
            }
        }

        if (firstRow === -1) {
            return 0;
        }

        return lastRow - firstRow + 1;
    }

    computeTouchLiftOffset(piece) {
        const height = Math.max(1, this.calculatePieceHeight(piece));
        const gap = this.CELL_SIZE * 0.2;
        const rawLift = height * this.CELL_SIZE - gap;
        const minLift = this.CELL_SIZE * 0.8;
        const maxLift = this.CELL_SIZE * 2.2;
        const clamped = Math.max(minLift, Math.min(rawLift, maxLift));
        const sizedLift = Math.max(this.TOUCH_LIFT_BASE, clamped);
        return Math.max(this.MIN_TOUCH_LIFT, sizedLift);
    }

    getEffectiveTouchLift(touchClientY, canvasRect) {
        const fullLift = this.touchLiftOffset;
        const distanceToBottom = this.canvas.height - (touchClientY - canvasRect.top);
        const safeBuffer = this.CELL_SIZE * 0.25;
        const minLift = this.MIN_TOUCH_LIFT;

        if (distanceToBottom <= fullLift + safeBuffer) {
            const maxLiftBySpace = Math.max(0, distanceToBottom - safeBuffer);
            return Math.max(minLift, Math.min(fullLift, maxLiftBySpace));
        }

        return Math.max(minLift, fullLift);
    }


    setupEventListeners() {
        // События для canvas
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // События для фигур - touch события
        this.piecesContainer.addEventListener('touchstart', (e) => this.handlePieceTouchStart(e), { passive: false });
        this.piecesContainer.addEventListener('touchmove', (e) => this.handlePieceTouchMove(e), { passive: false });
        this.piecesContainer.addEventListener('touchend', (e) => this.handlePieceTouchEnd(e), { passive: false });
        
        // События для фигур - mouse события (для тестирования на ПК)
        this.piecesContainer.addEventListener('mousedown', (e) => this.handlePieceMouseStart(e));
        this.piecesContainer.addEventListener('mousemove', (e) => this.handlePieceMouseMove(e));
        this.piecesContainer.addEventListener('mouseup', (e) => this.handlePieceMouseEnd(e));
        
        // Кнопки управления
        document.getElementById('backBtn').addEventListener('click', () => this.restart());
        document.getElementById('settingsBtn').addEventListener('click', () => this.clearBoard());
        
        // Предотвращаем скролл страницы при перетаскивании
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Предотвращаем контекстное меню
        this.piecesContainer.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Глобальные mouse события для перетаскивания
        document.addEventListener('mousemove', (e) => this.handlePieceMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handlePieceMouseEnd(e));
    }
    
    handlePieceTouchStart(e) {
        const pieceElement = e.target.closest('.piece-item');
        if (!pieceElement) return;
        
        const pieceId = pieceElement.dataset.pieceId;
        const piece = this.availablePieces.find(p => p.uniqueId === pieceId);
        
        if (piece) {
            this.selectPiece(piece, pieceElement);
            
            this.draggedPiece = piece;
            this.isDragging = true;
            this.isTouchDragging = true;
            this.touchLiftOffset = this.computeTouchLiftOffset(piece);
            pieceElement.classList.add('dragging');
            
            const touch = e.touches[0];
            const rect = pieceElement.getBoundingClientRect();
            this.dragOffset = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
            
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchMoved = false;
            
            e.preventDefault();
        }
    }
    
    handlePieceTouchMove(e) {
        if (!this.isDragging || !this.draggedPiece) return;
        
        const touch = e.touches[0];
        const canvasRect = this.canvas.getBoundingClientRect();
        
        const deltaX = Math.abs(touch.clientX - this.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        if (deltaX > 5 || deltaY > 5) {
            this.touchMoved = true;
        }
        
        const canvasX = touch.clientX - canvasRect.left;
        const effectiveLift = this.getEffectiveTouchLift(touch.clientY, canvasRect);
        const rawCanvasY = touch.clientY - canvasRect.top - effectiveLift;
        const adjustedCanvasY = Math.max(0, rawCanvasY);
        
        const gridX = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(canvasX / this.CELL_SIZE)));
        const gridY = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(adjustedCanvasY / this.CELL_SIZE)));
        
        this.drawWithPreview(gridX, gridY, this.canPlacePiece(this.draggedPiece, gridX, gridY));
        
        e.preventDefault();
    }
    
    handlePieceTouchEnd(e) {
        if (!this.isDragging || !this.draggedPiece) return;
        
        const touch = e.changedTouches[0];
        const canvasRect = this.canvas.getBoundingClientRect();
        
        const effectiveLift = this.getEffectiveTouchLift(touch.clientY, canvasRect);
        const dynamicMargin = Math.max(10, effectiveLift + this.CELL_SIZE * 0.5);
        if (touch.clientX >= canvasRect.left - dynamicMargin && touch.clientX <= canvasRect.right + dynamicMargin &&
            touch.clientY >= canvasRect.top - dynamicMargin && touch.clientY <= canvasRect.bottom + dynamicMargin) {
            
            const canvasX = touch.clientX - canvasRect.left;
            const rawCanvasY = touch.clientY - canvasRect.top - effectiveLift;
            const adjustedCanvasY = Math.max(0, rawCanvasY);
            
            const gridX = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(canvasX / this.CELL_SIZE)));
            const gridY = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(adjustedCanvasY / this.CELL_SIZE)));
            
            if (this.touchMoved && this.canPlacePiece(this.draggedPiece, gridX, gridY)) {
                this.placePiece(this.draggedPiece, gridX, gridY);
            }
        }
        
        this.isDragging = false;
        this.draggedPiece = null;
        this.touchMoved = false;
        this.isTouchDragging = false;
        this.touchLiftOffset = this.TOUCH_LIFT_BASE;
        
        document.querySelectorAll('.piece-item').forEach(el => {
            el.classList.remove('dragging');
        });
        
        this.clearSelection();
        
        this.draw();
        e.preventDefault();
    }
    
    handleTouchStart(e) {
        // Обработка тачей по canvas (для будущих функций)
        e.preventDefault();
    }
    
    handleTouchMove(e) {
        e.preventDefault();
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
    }
    
    // Mouse события для тестирования на ПК
    handlePieceMouseStart(e) {
        const pieceElement = e.target.closest('.piece-item');
        if (!pieceElement) return;
        
        const pieceId = pieceElement.dataset.pieceId;
        const piece = this.availablePieces.find(p => p.uniqueId === pieceId);
        
        if (piece) {
            // Выбираем фигуру при клике
            this.selectPiece(piece, pieceElement);
            
            // Устанавливаем как перетаскиваемую фигуру
            this.draggedPiece = piece;
            this.isDragging = true;
            pieceElement.classList.add('dragging');
            
            this.dragOffset = {
                x: e.offsetX,
                y: e.offsetY
            };
            
            e.preventDefault();
        }
    }
    
    handlePieceMouseMove(e) {
        if (!this.isDragging || !this.draggedPiece) return;
        
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Вычисляем позицию на canvas
        const canvasX = e.clientX - canvasRect.left;
        const canvasY = e.clientY - canvasRect.top;
        
        // Конвертируем в координаты сетки с проверкой границ
        const gridX = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(canvasX / this.CELL_SIZE)));
        const gridY = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(canvasY / this.CELL_SIZE)));
        
        // Всегда показываем полупрозрачную фигуру, независимо от возможности размещения
        this.drawWithPreview(gridX, gridY, this.canPlacePiece(this.draggedPiece, gridX, gridY));
        
        e.preventDefault();
    }
    
    handlePieceMouseEnd(e) {
        if (!this.isDragging || !this.draggedPiece) return;
        
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Проверяем, был ли клик над canvas (с небольшим запасом для лучшего UX)
        const margin = 10; // Добавляем запас в 10px
        if (e.clientX >= canvasRect.left - margin && e.clientX <= canvasRect.right + margin &&
            e.clientY >= canvasRect.top - margin && e.clientY <= canvasRect.bottom + margin) {
            
            const canvasX = e.clientX - canvasRect.left;
            const canvasY = e.clientY - canvasRect.top;
            
            // Используем Math.round вместо Math.floor для более точного позиционирования
            // и добавляем проверку на границы
            const gridX = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(canvasX / this.CELL_SIZE)));
            const gridY = Math.max(0, Math.min(this.BOARD_SIZE - 1, Math.round(canvasY / this.CELL_SIZE)));
            
            if (this.canPlacePiece(this.draggedPiece, gridX, gridY)) {
                this.placePiece(this.draggedPiece, gridX, gridY);
            }
        }
        
        // Сбрасываем состояние
        this.isDragging = false;
        this.draggedPiece = null;
        
        // Убираем класс dragging со всех элементов
        document.querySelectorAll('.piece-item').forEach(el => {
            el.classList.remove('dragging');
        });
        
        // Убираем выделение с фигуры
        this.clearSelection();
        
        this.draw();
        e.preventDefault();
    }
    
    canPlacePiece(piece, x, y) {
        for (let py = 0; py < piece.shape.length; py++) {
            for (let px = 0; px < piece.shape[py].length; px++) {
                if (piece.shape[py][px]) {
                    const boardX = x + px;
                    const boardY = y + py;
                    
                    if (boardX < 0 || boardX >= this.BOARD_SIZE || 
                        boardY < 0 || boardY >= this.BOARD_SIZE || 
                        this.board[boardY][boardX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    placePiece(piece, x, y) {
        if (!this.canPlacePiece(piece, x, y)) {
            return false;
        }
        
        // Размещаем фигуру на доске
        for (let py = 0; py < piece.shape.length; py++) {
            for (let px = 0; px < piece.shape[py].length; px++) {
                if (piece.shape[py][px]) {
                    const boardX = x + px;
                    const boardY = y + py;
                    this.board[boardY][boardX] = 1;
                }
            }
        }
        
        // Удаляем использованную фигуру
        this.availablePieces = this.availablePieces.filter(p => p.uniqueId !== piece.uniqueId);
        
        // Убираем выделение с размещенной фигуры
        this.clearSelection();
        
        // Проверяем заполненные линии
        this.checkLines();
        
        // Если фигуры закончились, генерируем новые
        if (this.availablePieces.length === 0) {
            this.generatePieces();
        } else {
            this.renderPieces(false); // Без анимации при обновлении панели
        }
        
        this.draw();
        this.updateUI();
        
        // Автоматически сохраняем игру после каждого размещения фигуры
        this.saveGameState();
        
        // Проверяем условия окончания игры
        this.checkGameOver();
        
        return true;
    }
    
    checkLines() {
        let linesCleared = 0;
        
        // Проверяем строки
        for (let y = 0; y < this.BOARD_SIZE; y++) {
            if (this.board[y].every(cell => cell === 1)) {
                this.board[y].fill(0);
                linesCleared++;
            }
        }
        
        // Проверяем столбцы
        for (let x = 0; x < this.BOARD_SIZE; x++) {
            if (this.board.every(row => row[x] === 1)) {
                for (let y = 0; y < this.BOARD_SIZE; y++) {
                    this.board[y][x] = 0;
                }
                linesCleared++;
            }
        }
        
        // Проверяем все 9 регионов 3x3 (как в классическом судоку)
        const regionsToCheck = [
            { startX: 0, startY: 0 },   // Верхний левый
            { startX: 3, startY: 0 },   // Верхний центральный
            { startX: 6, startY: 0 },   // Верхний правый
            { startX: 0, startY: 3 },   // Средний левый
            { startX: 3, startY: 3 },   // Центральный
            { startX: 6, startY: 3 },   // Средний правый
            { startX: 0, startY: 6 },   // Нижний левый
            { startX: 3, startY: 6 },   // Нижний центральный
            { startX: 6, startY: 6 }    // Нижний правый
        ];
        
        for (let region of regionsToCheck) {
            if (this.isRegionFilled(region.startX, region.startY)) {
                this.clearRegion(region.startX, region.startY);
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            const oldLevel = this.level;
            this.lines += linesCleared;
            this.score += linesCleared * 10 * this.level;
            this.level = Math.floor(this.lines / 20) + 1; // Увеличиваем с 10 до 20 линий для следующего уровня
            
            // Проверяем, достигли ли нового уровня
            if (this.level > oldLevel) {
                this.showLevelUpCompliment();
            }
            
            this.updateUI();
            
            // Сохраняем игру после очистки линий
            this.saveGameState();
        }
    }
    
    // Проверяет, заполнен ли 3x3 регион
    isRegionFilled(startX, startY) {
        for (let y = startY; y < startY + 3; y++) {
            for (let x = startX; x < startX + 3; x++) {
                if (this.board[y][x] !== 1) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Очищает 3x3 регион
    clearRegion(startX, startY) {
        for (let y = startY; y < startY + 3; y++) {
            for (let x = startX; x < startX + 3; x++) {
                this.board[y][x] = 0;
            }
        }
    }
    
    // Проверяет, есть ли доступные ходы для всех фигур
    hasAvailableMoves() {
        // Если нет фигур, игра не окончена (будут сгенерированы новые)
        if (this.availablePieces.length === 0) {
            return true;
        }
        
        // Получаем список свободных клеток для оптимизации
        const freeCells = this.getFreeCells();
        
        // Проверяем каждую доступную фигуру
        for (let piece of this.availablePieces) {
            // Проверяем только свободные клетки как потенциальные позиции
            for (let cell of freeCells) {
                if (this.canPlacePiece(piece, cell.x, cell.y)) {
                    return true; // Найдена хотя бы одна доступная позиция
                }
            }
        }
        
        return false; // Нет доступных ходов
    }
    
    // Получает список свободных клеток на доске
    getFreeCells() {
        const freeCells = [];
        for (let y = 0; y < this.BOARD_SIZE; y++) {
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                if (this.board[y][x] === 0) {
                    freeCells.push({ x, y });
                }
            }
        }
        return freeCells;
    }
    
    // Проверяет условия окончания игры
    checkGameOver() {
        if (!this.gameRunning) {
            return; // Игра уже окончена
        }
        
        // Проверяем, есть ли доступные ходы
        if (!this.hasAvailableMoves()) {
            this.gameOver();
        }
    }
    
    // Подсчитывает количество доступных ходов
    countAvailableMoves() {
        if (this.availablePieces.length === 0) {
            return 0;
        }
        
        let moveCount = 0;
        const freeCells = this.getFreeCells();
        
        for (let piece of this.availablePieces) {
            for (let cell of freeCells) {
                if (this.canPlacePiece(piece, cell.x, cell.y)) {
                    moveCount++;
                }
            }
        }
        
        return moveCount;
    }
    
    getCurrentColor() {
        if (document.body.classList.contains('pink-theme')) {
            return '#e91e63';
        } else if (document.body.classList.contains('blue-theme')) {
            return '#2196f3';
        }
        return '#007AFF'; // Синий цвет в стиле iOS по умолчанию
    }
    
    drawWithPreview(previewX, previewY, canPlace = true) {
        this.draw();
        
        if (this.draggedPiece) {
            // Устанавливаем цвет в зависимости от возможности размещения
            if (canPlace) {
                this.ctx.fillStyle = this.draggedPiece.color;
                this.ctx.globalAlpha = 0.7;
            } else {
                this.ctx.fillStyle = '#ff4444'; // Красный цвет когда нельзя поставить
                this.ctx.globalAlpha = 0.5;
            }
            
            for (let py = 0; py < this.draggedPiece.shape.length; py++) {
                for (let px = 0; px < this.draggedPiece.shape[py].length; px++) {
                    if (this.draggedPiece.shape[py][px]) {
                        const x = (previewX + px) * this.CELL_SIZE;
                        const y = (previewY + py) * this.CELL_SIZE;
                        
                        this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                        
                        // Добавляем обводку для лучшей видимости
                        this.ctx.strokeStyle = canPlace ? '#4a5568' : '#ff0000';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                    }
                }
            }
            
            this.ctx.globalAlpha = 1;
        }
    }
    
    draw() {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем сетку судоку
        this.drawSudokuGrid();
        
        // Рисуем размещенные фигуры
        this.drawBoard();
    }
    
    drawSudokuGrid() {
        // Сначала рисуем фоновые цвета для регионов 2, 4, 5, 6, 8
        this.drawRegionBackgrounds();
        
        this.ctx.strokeStyle = '#e5e5e5';
        this.ctx.lineWidth = 1;
        
        // Рисуем все линии одинаковой толщины (обычная сетка)
        for (let i = 0; i <= this.BOARD_SIZE; i++) {
            const pos = i * this.CELL_SIZE;
            
            // Вертикальные линии
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            // Горизонтальные линии
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }
    
    drawRegionBackgrounds() {
        this.ctx.fillStyle = '#e9eef5';
        
        // Регионы для заливки: 2, 4, 5, 6, 8
        const regionsToFill = [
            { startX: 3, startY: 0 },   // Регион 2: Верхний центральный
            { startX: 0, startY: 3 },   // Регион 4: Средний левый
            { startX: 3, startY: 3 },   // Регион 5: Центральный
            { startX: 6, startY: 3 },   // Регион 6: Средний правый
            { startX: 3, startY: 6 }     // Регион 8: Нижний центральный
        ];
        
        for (let region of regionsToFill) {
            const x = region.startX * this.CELL_SIZE;
            const y = region.startY * this.CELL_SIZE;
            const size = 3 * this.CELL_SIZE;
            
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    drawBoard() {
        const color = this.getCurrentColor();
        
        for (let y = 0; y < this.BOARD_SIZE; y++) {
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x * this.CELL_SIZE + 1, y * this.CELL_SIZE + 1, 
                                    this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                }
            }
        }
    }
    
    updateUI() {
        document.getElementById('levelDisplay').textContent = this.level;
        document.getElementById('record').textContent = this.record;
        document.getElementById('currentScore').textContent = this.score;
    }
    
    // Показывает комплимент при достижении нового уровня
    showLevelUpCompliment() {
        // Выбираем случайный комплимент
        const randomCompliment = this.compliments[Math.floor(Math.random() * this.compliments.length)];
        
        // Создаем элемент для комплимента
        const complimentElement = document.createElement('div');
        complimentElement.className = 'level-up-compliment';
        complimentElement.innerHTML = `
            <div class="compliment-content">
                <div class="level-badge">Уровень ${this.level}! 🎉</div>
                <div class="compliment-text">${randomCompliment}</div>
                <button class="compliment-close">Продолжить игру</button>
            </div>
        `;
        
        // Добавляем в DOM
        document.body.appendChild(complimentElement);
        
        // Анимация появления
        setTimeout(() => {
            complimentElement.classList.add('show');
        }, 100);
        
        // Обработчик закрытия
        const closeBtn = complimentElement.querySelector('.compliment-close');
        closeBtn.addEventListener('click', () => {
            complimentElement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(complimentElement);
            }, 300);
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (document.body.contains(complimentElement)) {
                complimentElement.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(complimentElement)) {
                        document.body.removeChild(complimentElement);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    clearBoard() {
        this.board = Array(this.BOARD_SIZE).fill().map(() => Array(this.BOARD_SIZE).fill(0));
        this.draw();
        
        // Сохраняем игру после очистки доски
        this.saveGameState();
    }
    
    
    gameOver() {
        this.gameRunning = false;
        
        // Проверяем рекорд
        const isNewRecord = this.saveRecord(this.score);
        
        const gameOverElement = document.getElementById('gameOver');
        
        // Обновляем интерфейс в зависимости от того, установлен ли новый рекорд
        if (isNewRecord) {
            gameOverElement.innerHTML = `
                <h2>🎉 Новый рекорд!</h2>
                <p>Поздравляем! Вы установили новый рекорд:</p>
                <div class="final-score">${this.score}</div>
                <p class="record-info">Предыдущий рекорд: ${this.record - this.score}</p>
                <button id="restartGameBtn">Играть снова</button>
            `;
        } else {
            gameOverElement.innerHTML = `
                <h2>Игра окончена!</h2>
                <p>Ваш результат:</p>
                <div class="final-score">${this.score}</div>
                <p class="record-info">Рекорд: ${this.record}</p>
                <button id="restartGameBtn">Играть снова</button>
            `;
        }
        
        // Добавляем обработчик события для кнопки
        const restartBtn = document.getElementById('restartGameBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restart();
            });
        }
        
        gameOverElement.style.display = 'block';
        
        // Обновляем отображение рекорда в интерфейсе
        this.updateUI();
    }
    
    restart() {
        this.board = Array(this.BOARD_SIZE).fill().map(() => Array(this.BOARD_SIZE).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = true;
        this.draggedPiece = null;
        this.isDragging = false;
        
        // Сбрасываем выделение
        this.clearSelection();
        
        // Очищаем сохраненное состояние при перезапуске
        this.clearGameState();
        
        document.getElementById('gameOver').style.display = 'none';
        this.updateUI();
        this.generatePieces();
        this.draw();
    }
}

// Глобальные функции для HTML
window.restartGame = function() {
    if (window.game) {
        window.game.restart();
    }
};

// Theme switching functionality
class ThemeManager {
    constructor() {
        this.currentTheme = 'red'; // red, pink, blue
        this.themes = ['red', 'pink', 'blue'];
        this.themeIndex = 0;
        this.init();
    }
    
    init() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.switchTheme());
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('sudokuTetrisTheme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.setTheme(savedTheme);
        }
    }
    
    switchTheme() {
        this.themeIndex = (this.themeIndex + 1) % this.themes.length;
        const newTheme = this.themes[this.themeIndex];
        this.setTheme(newTheme);
        localStorage.setItem('sudokuTetrisTheme', newTheme);
    }
    
    setTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove('pink-theme', 'blue-theme');
        
        if (theme === 'pink') {
            document.body.classList.add('pink-theme');
            this.updatePieceColors('#e91e63');
        } else if (theme === 'blue') {
            document.body.classList.add('blue-theme');
            this.updatePieceColors('#2196f3');
        } else {
            this.updatePieceColors('#e74c3c');
        }
        
        this.currentTheme = theme;
    }
    
    updatePieceColors(color) {
        // Update piece colors in the game
        if (window.game && window.game.tetrisPieces) {
            window.game.tetrisPieces.forEach(piece => {
                piece.color = color;
            });
            // Обновляем цвета доступных фигур
            if (window.game.availablePieces) {
                window.game.availablePieces.forEach(piece => {
                    piece.color = color;
                });
            }
            window.game.draw();
            window.game.renderPieces(false);
        }
    }
}

// Инициализация игры
let game;
let themeManager;
window.addEventListener('load', () => {
    game = new MobileSudokuTetris();
    window.game = game; // Делаем доступным глобально
    themeManager = new ThemeManager();
});