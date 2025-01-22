export class ButtonsTable {
    label: string;
    action: (element: any) => void;
    class: string;
    showCondition: (element: any) => boolean;

    constructor(data: Partial<ButtonsTable> = {}) {
        this.label = data.label || '';
        this.action = null;
        this.class = '';
    }
}
