import {
    BillingCycle,
    BillingType,
    ContractType,
    ScheduledActionType,
    Status,
    TermDuration,
    UnitType,
} from './types'
import {
    buildProductTermFromSubscription,
    buildScheduledCancelAction,
    buildScheduledNextTermInstructions,
    getScheduledRenewalQuantity,
    isSubscriptionInCancellationWindow,
    parseNceOfferId,
} from './subscription-scheduling.util'

const baseSubscription = {
    id: 'sub-1',
    offerId: 'CFQ7TTC0LH16:0001:AVAIL123',
    offerName: 'Test License',
    friendlyName: 'Test License',
    quantity: 10,
    unitType: UnitType.Licenses,
    hasPurchasableAddons: false,
    creationDate: new Date('2026-01-01'),
    effectiveStartDate: new Date('2026-01-01'),
    commitmentEndDate: new Date('2026-02-01'),
    status: Status.Active,
    autoRenewEnabled: true,
    isTrial: false,
    billingType: BillingType.License,
    billingCycle: BillingCycle.Monthly,
    termDuration: TermDuration.P1M,
    isMicrosoftProduct: true,
    attentionNeeded: false,
    actionTaken: false,
    contractType: ContractType.Subscription,
    links: {} as any,
    orderId: 'order-1',
    attributes: { objectType: 'Subscription' as any },
}

describe('subscription-scheduling.util', () => {
    describe('parseNceOfferId', () => {
        it('parses productId, skuId, and availabilityId', () => {
            expect(parseNceOfferId('CFQ7TTC0LH16:0001:AVAIL123')).toEqual({
                productId: 'CFQ7TTC0LH16',
                skuId: '0001',
                availabilityId: 'AVAIL123',
            })
        })

        it('returns null when offerId is malformed', () => {
            expect(parseNceOfferId('only-product')).toBeNull()
        })
    })

    describe('isSubscriptionInCancellationWindow', () => {
        it('returns true when refundableQuantity is positive', () => {
            expect(
                isSubscriptionInCancellationWindow({
                    ...baseSubscription,
                    refundableQuantity: { totalQuantity: 2, details: [] },
                }),
            ).toBe(true)
        })

        it('returns true when cancellationAllowedUntilDate is in the future', () => {
            expect(
                isSubscriptionInCancellationWindow({
                    ...baseSubscription,
                    cancellationAllowedUntilDate: new Date(Date.now() + 86_400_000),
                }),
            ).toBe(true)
        })

        it('returns false when outside the cancellation window', () => {
            expect(
                isSubscriptionInCancellationWindow({
                    ...baseSubscription,
                    refundableQuantity: { totalQuantity: 0, details: [] },
                    cancellationAllowedUntilDate: new Date('2020-01-01'),
                }),
            ).toBe(false)
        })
    })

    describe('buildScheduledNextTermInstructions', () => {
        it('builds instructions from the current subscription product identity', () => {
            const instructions = buildScheduledNextTermInstructions(baseSubscription, 8)

            expect(instructions.quantity).toBe(8)
            expect(instructions.product).toEqual({
                productId: 'CFQ7TTC0LH16',
                skuId: '0001',
                availabilityId: 'AVAIL123',
                billingCycle: BillingCycle.Monthly,
                termDuration: TermDuration.P1M,
                promotionId: undefined,
            })
        })
    })

    describe('buildProductTermFromSubscription', () => {
        it('throws when availabilityId is missing from offerId', () => {
            expect(() =>
                buildProductTermFromSubscription({
                    ...baseSubscription,
                    offerId: 'CFQ7TTC0LH16:0001',
                }),
            ).toThrow(/availabilityId/i)
        })
    })

    describe('buildScheduledCancelAction', () => {
        it('returns a TermEnd Cancel action', () => {
            expect(buildScheduledCancelAction()).toEqual({
                scheduleType: 'TermEnd',
                actionType: ScheduledActionType.Cancel,
            })
        })
    })

    describe('getScheduledRenewalQuantity', () => {
        it('reads quantity from scheduledNextTermInstructions first', () => {
            expect(
                getScheduledRenewalQuantity({
                    ...baseSubscription,
                    scheduledNextTermInstructions: {
                        product: buildProductTermFromSubscription(baseSubscription),
                        quantity: 42,
                    },
                }),
            ).toBe(42)
        })

        it('falls back to scheduledActions RenewToNewTerm quantity', () => {
            expect(
                getScheduledRenewalQuantity({
                    ...baseSubscription,
                    scheduledActions: [
                        {
                            scheduleType: 'TermEnd',
                            actionType: ScheduledActionType.RenewToNewTerm,
                            instructions: {
                                product: buildProductTermFromSubscription(baseSubscription),
                                quantity: 37,
                            },
                        },
                    ],
                }),
            ).toBe(37)
        })
    })
})
