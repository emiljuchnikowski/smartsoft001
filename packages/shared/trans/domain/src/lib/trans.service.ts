import {ObjectService} from "@smartsoft001/utils";
import {IItemRepository} from "@smartsoft001/domain-core";

import {Trans, TransHistory} from "./entities/trans.entity";

export abstract class TransBaseService<T> {
    protected constructor(protected repository: IItemRepository<Trans<T>>) {
    }

    protected addHistory(trans: Trans<T>, data: any): void {
        const historyItem = new TransHistory<T>();
        historyItem.amount = trans.amount;
        historyItem.modifyDate = trans.modifyDate;
        historyItem.data = ObjectService.removeTypes(data);
        historyItem.system = trans.system;
        historyItem.status = trans.status;
        if (!trans.history) trans.history = [];
        trans.history.push(historyItem);
    }

    protected async setError(trans: Trans<T>, error): Promise<void> {
        trans.modifyDate = new Date();
        trans.status = "error";
        this.addHistory(trans, error);

        await this.repository.update(trans as any, null);
    }
}

