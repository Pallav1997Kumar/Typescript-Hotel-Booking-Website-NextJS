interface IContextSlug {
    params: {
        slug: string;
    };
}


interface IContextUserId {
    params: {
        userId: string;
    };
}


interface IContextCartId {
    params: {
        cartId: string;
    };
}


interface IContextTransactionId {
    params: {
        transactionId: string;
    };
}

export type { IContextSlug, IContextUserId, IContextCartId, IContextTransactionId }; 