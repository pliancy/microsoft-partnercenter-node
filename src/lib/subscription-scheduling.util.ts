import {
    ProductTerm,
    ScheduledAction,
    ScheduledActionScheduleType,
    ScheduledActionType,
    ScheduledNextTermInstructions,
    Subscription,
} from './types'

export interface ParsedNceOfferId {
    productId: string
    skuId: string
    availabilityId?: string
}

export function parseNceOfferId(offerId: string): ParsedNceOfferId | null {
    const [productId, skuId, availabilityId] = offerId.split(':')
    if (!productId || !skuId) return null
    return { productId, skuId, availabilityId }
}

export function isSubscriptionInCancellationWindow(subscription: Subscription): boolean {
    const refundableQuantity = subscription.refundableQuantity?.totalQuantity ?? 0
    if (refundableQuantity > 0) return true

    const allowedUntil = subscription.cancellationAllowedUntilDate
    if (!allowedUntil) return false

    return new Date(allowedUntil).getTime() > Date.now()
}

export function buildProductTermFromSubscription(subscription: Subscription): ProductTerm {
    const parsed = parseNceOfferId(subscription.offerId)
    if (!parsed) {
        throw new Error(`Unable to parse NCE offerId: ${subscription.offerId}`)
    }

    if (!parsed.availabilityId) {
        throw new Error(`Subscription ${subscription.id} offerId is missing availabilityId segment`)
    }

    return {
        productId: parsed.productId,
        skuId: parsed.skuId,
        availabilityId: parsed.availabilityId,
        billingCycle: subscription.billingCycle,
        termDuration: subscription.termDuration,
        promotionId: subscription.promotionId,
    }
}

export function buildScheduledNextTermInstructions(
    subscription: Subscription,
    quantity: number,
    customTermEndDate?: string | Date,
): ScheduledNextTermInstructions {
    return {
        product: buildProductTermFromSubscription(subscription),
        quantity,
        customTermEndDate: customTermEndDate ?? subscription.customTermEndDate,
    }
}

export function buildScheduledRenewalAction(
    subscription: Subscription,
    quantity: number,
    customTermEndDate?: string | Date,
): ScheduledAction {
    return {
        scheduleType: ScheduledActionScheduleType.TermEnd,
        actionType: ScheduledActionType.RenewToNewTerm,
        instructions: buildScheduledNextTermInstructions(subscription, quantity, customTermEndDate),
    }
}

export function buildScheduledCancelAction(): ScheduledAction {
    return {
        scheduleType: ScheduledActionScheduleType.TermEnd,
        actionType: ScheduledActionType.Cancel,
    }
}

export function getScheduledRenewalQuantity(subscription: Subscription): number | undefined {
    return (
        subscription.scheduledNextTermInstructions?.quantity ??
        subscription.scheduledActions?.find(
            (action) => action.actionType === ScheduledActionType.RenewToNewTerm,
        )?.instructions?.quantity
    )
}
