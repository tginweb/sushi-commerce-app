export function scrollViewIsCloseToBottom(
    {
        layoutMeasurementHeight,
        contentOffsetY,
        contentSizeHeight
    }: {
        layoutMeasurementHeight: number,
        contentOffsetY: number,
        contentSizeHeight: number
    }
) {
    const paddingToBottom = 20;
    return layoutMeasurementHeight + contentOffsetY >= contentSizeHeight - paddingToBottom;
}

export default scrollViewIsCloseToBottom
