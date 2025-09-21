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
        
        this.MAX_BLOCKS_PER_PIECE = 4;
        this.CLEAR_ANIMATION_DURATION = 360;
        this.clearAnimations = [];
        this.animationFrameId = null;
        
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
        
        this.tetrisPieces = this.tetrisPieces.filter(piece => this.countCubes(piece.shape) <= this.MAX_BLOCKS_PER_PIECE);
        
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
        const piecesToGenerate = 5; // Number of pieces shown on the tray
        
        const allVariants = [];
        this.tetrisPieces.forEach(piece => {
            const variants = this.createShapeVariants(piece);
            allVariants.push(...variants);
        });
        
        for (let i = 0; i < piecesToGenerate; i++) {
            if (allVariants.length === 0) {
                break;
            }
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
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const baseColor = piece.color || this.getCurrentColor();
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const pixelX = x * cellSize;
                    const pixelY = y * cellSize;
                    this.drawGlassCell(ctx, pixelX, pixelY, cellSize, baseColor, {
                        glow: true,
                        alpha: 0.92
                    });
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
        const rowsToClear = [];
        const columnsToClear = [];
        const regionsToClear = [];
        const size = this.BOARD_SIZE;

        for (let y = 0; y < size; y++) {
            if (this.board[y].every(cell => cell === 1)) {
                rowsToClear.push(y);
            }
        }

        for (let x = 0; x < size; x++) {
            if (this.board.every(row => row[x] === 1)) {
                columnsToClear.push(x);
            }
        }

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
                regionsToClear.push(region);
            }
        }

        const linesCleared = rowsToClear.length + columnsToClear.length + regionsToClear.length;

        if (linesCleared === 0) {
            return;
        }

        const cellsMap = new Map();
        const rememberCell = (x, y) => {
            const key = `${x},${y}`;
            if (!cellsMap.has(key)) {
                cellsMap.set(key, { x, y });
            }
        };

        rowsToClear.forEach(y => {
            for (let x = 0; x < size; x++) {
                if (this.board[y][x] === 1) {
                    rememberCell(x, y);
                }
            }
        });

        columnsToClear.forEach(x => {
            for (let y = 0; y < size; y++) {
                if (this.board[y][x] === 1) {
                    rememberCell(x, y);
                }
            }
        });

        regionsToClear.forEach(region => {
            for (let y = region.startY; y < region.startY + 3; y++) {
                for (let x = region.startX; x < region.startX + 3; x++) {
                    if (this.board[y][x] === 1) {
                        rememberCell(x, y);
                    }
                }
            }
        });

        const clearedCells = Array.from(cellsMap.values());
        clearedCells.forEach(({ x, y }) => {
            this.board[y][x] = 0;
        });

        if (clearedCells.length) {
            this.triggerClearAnimation(clearedCells);
        }

        const oldLevel = this.level;
        this.lines += linesCleared;
        this.score += linesCleared * 10 * this.level;
        this.level = Math.floor(this.lines / 20) + 1;

        if (this.level > oldLevel) {
            this.showLevelUpCompliment();
        }

        this.updateUI();
        this.saveGameState();
    }

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

        if (!this.draggedPiece) {
            return;
        }

        const baseColor = canPlace ? this.getCurrentColor() : '#ff4d4f';
        const previewOptions = canPlace
            ? { alpha: 0.65, glow: true, outlineColor: this.lightenColor(baseColor, 0.5) }
            : { alpha: 0.55, outlineColor: '#ff4d4f' };

        for (let py = 0; py < this.draggedPiece.shape.length; py++) {
            for (let px = 0; px < this.draggedPiece.shape[py].length; px++) {
                if (this.draggedPiece.shape[py][px]) {
                    const x = (previewX + px) * this.CELL_SIZE;
                    const y = (previewY + py) * this.CELL_SIZE;
                    this.drawGlassCell(this.ctx, x, y, this.CELL_SIZE, baseColor, previewOptions);

                    if (!canPlace) {
                        this.ctx.save();
                        this.ctx.strokeStyle = this.addAlpha('#ff6b6b', 0.8);
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.roundRectPath(this.ctx, x + 2, y + 2, this.CELL_SIZE - 4, this.CELL_SIZE - 4, Math.max(4, this.CELL_SIZE * 0.22));
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawSudokuGrid();
        this.drawBoard();
        this.drawClearAnimations();
    }

    drawSudokuGrid() {
        this.drawRegionBackgrounds();

        this.ctx.save();
        this.ctx.strokeStyle = this.addAlpha('#cbd5f5', 0.4);
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= this.BOARD_SIZE; i++) {
            const pos = i * this.CELL_SIZE + 0.5;

            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }

        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = this.addAlpha('#e2e8f0', 0.5);

        for (let i = 0; i <= this.BOARD_SIZE; i += 3) {
            const pos = i * this.CELL_SIZE + 0.5;

            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawRegionBackgrounds() {
        this.ctx.save();

        const baseGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        baseGradient.addColorStop(0, this.addAlpha('#1f2937', 0.52));
        baseGradient.addColorStop(1, this.addAlpha('#0f172a', 0.68));
        this.ctx.fillStyle = baseGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const highlightGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        highlightGradient.addColorStop(0, this.addAlpha('#ffffff', 0.15));
        highlightGradient.addColorStop(0.35, this.addAlpha('#ffffff', 0.05));
        highlightGradient.addColorStop(1, this.addAlpha('#ffffff', 0));
        this.ctx.fillStyle = highlightGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

            const regionGradient = this.ctx.createRadialGradient(
                x + size / 2,
                y + size / 2,
                this.CELL_SIZE * 0.35,
                x + size / 2,
                y + size / 2,
                size * 0.95
            );
            regionGradient.addColorStop(0, this.addAlpha('#ffffff', 0.09));
            regionGradient.addColorStop(1, this.addAlpha('#ffffff', 0));
            this.ctx.fillStyle = regionGradient;
            this.ctx.fillRect(x, y, size, size);
        }

        this.ctx.restore();
    }

    drawBoard() {
        const baseColor = this.getCurrentColor();

        for (let y = 0; y < this.BOARD_SIZE; y++) {
            for (let x = 0; x < this.BOARD_SIZE; x++) {
                if (this.board[y][x]) {
                    const pixelX = x * this.CELL_SIZE;
                    const pixelY = y * this.CELL_SIZE;
                    this.drawGlassCell(this.ctx, pixelX, pixelY, this.CELL_SIZE, baseColor, {
                        glow: true,
                        alpha: 0.95
                    });
                }
            }
        }
    }

    drawClearAnimations() {
        if (!this.clearAnimations.length) {
            return;
        }

        const baseColor = this.getCurrentColor();

        this.clearAnimations.forEach(effect => {
            const progress = effect.progress ?? 0;
            effect.cells.forEach(cell => {
                const pixelX = cell.x * this.CELL_SIZE;
                const pixelY = cell.y * this.CELL_SIZE;
                this.drawClearBurst(pixelX, pixelY, progress, baseColor);
            });
        });
    }

    drawClearBurst(pixelX, pixelY, progress, baseColor) {
        const ctx = this.ctx;
        const centerX = pixelX + this.CELL_SIZE / 2;
        const centerY = pixelY + this.CELL_SIZE / 2;
        const expansion = this.CELL_SIZE * (0.4 + 0.6 * progress);

        const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            this.CELL_SIZE * 0.1,
            centerX,
            centerY,
            expansion
        );
        gradient.addColorStop(0, this.addAlpha('#ffffff', 0.75 * (1 - progress)));
        gradient.addColorStop(0.6, this.addAlpha(this.lightenColor(baseColor, 0.3), 0.45 * (1 - progress)));
        gradient.addColorStop(1, this.addAlpha(baseColor, 0));

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;
        ctx.fillRect(pixelX - expansion, pixelY - expansion, this.CELL_SIZE + expansion * 2, this.CELL_SIZE + expansion * 2);

        ctx.strokeStyle = this.addAlpha('#ffffff', 0.28 * (1 - progress));
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.CELL_SIZE * (0.55 + 0.4 * progress), 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    triggerClearAnimation(cells) {
        if (!cells || cells.length === 0) {
            return;
        }

        const effect = {
            cells: cells.map(cell => ({ x: cell.x, y: cell.y })),
            startTime: performance.now(),
            progress: 0
        };

        this.clearAnimations.push(effect);
        this.draw();
        this.ensureAnimationLoop();
    }

    ensureAnimationLoop() {
        if (this.animationFrameId) {
            return;
        }

        const step = (timestamp) => {
            this.updateClearAnimationProgress(timestamp);
            if (this.clearAnimations.length > 0) {
                this.draw();
                this.animationFrameId = requestAnimationFrame(step);
            } else {
                this.animationFrameId = null;
            }
        };

        this.animationFrameId = requestAnimationFrame(step);
    }

    updateClearAnimationProgress(timestamp) {
        const duration = this.CLEAR_ANIMATION_DURATION;

        this.clearAnimations = this.clearAnimations.filter(effect => {
            const elapsed = timestamp - effect.startTime;
            const progress = Math.min(1, elapsed / duration);
            effect.progress = progress;
            return elapsed < duration;
        });

        if (this.clearAnimations.length === 0 && this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    drawGlassCell(ctx, pixelX, pixelY, size, baseColor, options = {}) {
        const alpha = options.alpha ?? 1;
        const radius = Math.max(4, size * 0.22);

        ctx.save();

        if (options.glow) {
            ctx.shadowColor = this.addAlpha(this.lightenColor(baseColor, 0.3), 0.35 * alpha);
            ctx.shadowBlur = size * 0.65;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        const bodyGradient = ctx.createLinearGradient(pixelX, pixelY, pixelX, pixelY + size);
        bodyGradient.addColorStop(0, this.addAlpha(this.lightenColor(baseColor, 0.45), 0.82 * alpha));
        bodyGradient.addColorStop(0.5, this.addAlpha(baseColor, 0.78 * alpha));
        bodyGradient.addColorStop(1, this.addAlpha(this.darkenColor(baseColor, 0.3), 0.9 * alpha));

        ctx.beginPath();
        this.roundRectPath(ctx, pixelX + 1, pixelY + 1, size - 2, size - 2, radius);
        ctx.fillStyle = bodyGradient;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        ctx.beginPath();
        this.roundRectPath(ctx, pixelX + 1, pixelY + 1, size - 2, size - 2, radius);
        const outlineColor = options.outlineColor
            ? this.addAlpha(options.outlineColor, 0.85 * alpha)
            : this.addAlpha(this.lightenColor(baseColor, 0.55), 0.6 * alpha);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = outlineColor;
        ctx.stroke();

        const shineHeight = size * 0.42;
        const shineGradient = ctx.createLinearGradient(pixelX, pixelY, pixelX, pixelY + shineHeight);
        shineGradient.addColorStop(0, this.addAlpha('#ffffff', 0.8 * alpha));
        shineGradient.addColorStop(1, this.addAlpha('#ffffff', 0));
        ctx.beginPath();
        this.roundRectPath(ctx, pixelX + size * 0.18, pixelY + size * 0.1, size - size * 0.36, shineHeight, radius * 0.6);
        ctx.fillStyle = shineGradient;
        ctx.fill();

        const innerGradient = ctx.createLinearGradient(pixelX, pixelY + size, pixelX, pixelY);
        innerGradient.addColorStop(0, this.addAlpha('#0f172a', 0.18 * alpha));
        innerGradient.addColorStop(1, this.addAlpha('#0f172a', 0));
        ctx.beginPath();
        this.roundRectPath(ctx, pixelX + size * 0.12, pixelY + size * 0.52, size - size * 0.24, size * 0.32, radius * 0.35);
        ctx.fillStyle = innerGradient;
        ctx.fill();

        ctx.restore();
    }

    roundRectPath(ctx, x, y, width, height, radius) {
        const r = Math.max(0, Math.min(radius, width / 2, height / 2));
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    }

    hexToRgb(hex) {
        let cleaned = hex.replace('#', '');
        if (cleaned.length === 3) {
            cleaned = cleaned.split('').map(char => char + char).join('');
        }
        const num = parseInt(cleaned, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    addAlpha(hex, alpha) {
        const { r, g, b } = this.hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    lightenColor(hex, amount = 0.2) {
        const { r, g, b } = this.hexToRgb(hex);
        const adjust = (channel) => Math.round(channel + (255 - channel) * amount);
        return `#${[adjust(r), adjust(g), adjust(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
    }

    darkenColor(hex, amount = 0.2) {
        const { r, g, b } = this.hexToRgb(hex);
        const adjust = (channel) => Math.round(channel * (1 - amount));
        return `#${[adjust(r), adjust(g), adjust(b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
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