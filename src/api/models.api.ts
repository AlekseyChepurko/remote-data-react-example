export interface SearchResonse {
    pagination: {
        count: number;
        offset: number;
        total_count: number;
    };
    data: {
        id: string;
        images: {
            fixed_width: {
                height: string,
                width: string,
                url: string;
            }
        },
    }[],
    message?: string;
}
