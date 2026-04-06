import { dist } from "../utils.js";

export const voidChar = {
    id: "void",
    update: (state, ctx, canvas, buffs, changeStateFn) => {
        let { player, ghosts, boss, mouse, bullets } = state;

        // --- Logic Hố Đen (Blackholes) ---
        // Hố đen thường được tạo ra từ kỹ năng Q hoặc E (tùy thuộc vào thiết kế skills.js của bạn)
        if (state.voidBlackholes) {
            for (let i = state.voidBlackholes.length - 1; i >= 0; i--) {
                let bh = state.voidBlackholes[i];
                bh.life--;

                // Hút và khóa chân quái vật trong tầm ảnh hưởng
                ghosts.forEach((g) => {
                    if (g.x > 0) {
                        let d = dist(bh.x, bh.y, g.x, g.y);
                        if (d < 350) {
                            // Lực hút tăng dần khi quái gần tâm
                            g.x += (bh.x - g.x) * 0.1;
                            g.y += (bh.y - g.y) * 0.1;
                            // Khóa chân (stun) để quái không thể cưỡng lại lực hút
                            g.isStunned = Math.max(g.isStunned, 5);
                        }
                    }
                });

                if (bh.life <= 0) state.voidBlackholes.splice(i, 1);
            }
        }

        // --- Kỹ năng R: Siêu Tia Laser (Void Laser) ---
        if (buffs.r > 0) {
            // 1. Tính toán hướng và vị trí laser
            let angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
            state.voidLaser = { x: player.x, y: player.y, angle: angle };

            let p1 = { x: player.x, y: player.y };
            let p2 = {
                x: player.x + Math.cos(angle) * 1500,
                y: player.y + Math.sin(angle) * 1500,
            };

            // Hàm phụ tính khoảng cách từ 1 điểm đến đoạn thẳng (đường laser)
            const distToLine = (p, v, w) => {
                let l2 = dist(v.x, v.y, w.x, w.y) ** 2;
                if (l2 === 0) return dist(p.x, p.y, v.x, v.y);
                let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
                t = Math.max(0, Math.min(1, t));
                return dist(p.x, p.y, v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
            };

            // 2. Gây sát thương theo thời gian (Tick damage) mỗi 5 frame
            if (state.frameCount % 5 === 0) {
                ghosts.forEach((g) => {
                    if (g.x > 0 && distToLine({ x: g.x, y: g.y }, p1, p2) < g.radius + 20) {
                        g.hp -= 2;
                        g.isStunned = 15;
                    }
                });
                if (boss && distToLine({ x: boss.x, y: boss.y }, p1, p2) < boss.radius + 20) {
                    boss.hp -= 3;
                }
            }

            // 3. Xóa bỏ toàn bộ đạn của kẻ thù bay trúng tia laser
            bullets.forEach((b) => {
                if (!b.isPlayer) b.life = 0;
            });

            // Báo hiệu cho update.js chính là Void đang dùng R (để chặn bắn thường)
            state.voidR_Active = true;
        } else {
            state.voidLaser = null;
            state.voidR_Active = false;
        }
    },

    draw: (state, ctx, canvas, buffs) => {
        // 1. Vẽ các Hố Đen
        if (state.voidBlackholes) {
            state.voidBlackholes.forEach((bh) => {
                ctx.save();
                ctx.beginPath();
                // Hiệu ứng co giãn nhẹ cho hố đen
                const pulse = Math.sin(state.frameCount * 0.2) * 10;
                ctx.arc(bh.x, bh.y, 40 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.strokeStyle = "purple";
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = "purple";
                ctx.stroke();
                ctx.restore();
            });
        }

        // 2. Kỹ năng E: Phủ màn sương tím
        if (buffs.e > 0) {
            ctx.fillStyle = "rgba(128, 0, 128, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Vẽ Siêu Tia Laser (R)
        if (buffs.r > 0 && state.voidLaser) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(state.voidLaser.x, state.voidLaser.y);
            ctx.lineTo(
                state.voidLaser.x + Math.cos(state.voidLaser.angle) * 2000,
                state.voidLaser.y + Math.sin(state.voidLaser.angle) * 2000
            );

            // Viền laser tím đậm ngoài cùng
            ctx.strokeStyle = `rgba(100, 0, 200, 0.8)`;
            ctx.lineWidth = 40;
            ctx.stroke();

            // Lõi laser trắng sáng bên trong
            ctx.strokeStyle = `rgba(255, 255, 255, 0.9)`;
            ctx.lineWidth = 15;
            ctx.stroke();
            ctx.restore();
        }

        // 4. Filter tối màn hình khi bật R
        if (buffs.r > 0) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
};