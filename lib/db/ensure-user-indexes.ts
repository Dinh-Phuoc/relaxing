import mongoose from 'mongoose';

let indexesEnsured = false;

/** Xóa index email cũ (schema đã bỏ email) — tránh E11000 khi tạo user mới */
export async function ensureUserIndexes(): Promise<void> {
    if (indexesEnsured || mongoose.connection.readyState !== 1) {
        return;
    }

    const collection = mongoose.connection.collection('users');
    const indexes = await collection.indexes();

    for (const index of indexes) {
        const key = index.key as Record<string, number> | undefined;
        if (key?.email !== undefined && index.name) {
            try {
                await collection.dropIndex(index.name);
                console.log(`[db] Đã xóa index email cũ: ${index.name}`);
            } catch (err) {
                console.error(`[db] Không thể xóa index ${index.name}:`, err);
            }
        }
    }

    indexesEnsured = true;
}
