import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
    asBaseComponent,
    Assets,
    Button,
    Colors,
    Constants,
    Hooks,
    Incubator,
    TextField,
    View
} from "react-native-ui-lib";

import RNDateTimePicker from '@react-native-community/datetimepicker'
import useOldApi from "./useOldApi";
import {DateTimePickerProps} from "~ui/dateTimePicker/index.types";
import {UiActions} from "~ui/actions";
import {UiBtnProps} from "~ui/btn";

const useDidUpdate = Hooks.useDidUpdate

const ExpandableOverlay = Incubator.ExpandableOverlay

/*eslint-disable*/
/**
 * @description: Date and Time Picker Component that wraps RNDateTimePicker for date and time modes.
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/DateTimePickerScreen.tsx
 * @important: DateTimePicker uses a native library. You MUST add and link the native library to both iOS and Android projects.
 * @extends: TextField, react-native-community/datetimepicker
 * @extendsLink: https://github.com/react-native-community/react-native-datetimepicker#react-native-datetimepicker
 * @gif: https://github.com/wix/react-native-ui-lib/blob/master/demo/showcase/DateTimePicker/DateTimePicker_iOS.gif?raw=true, https://github.com/wix/react-native-ui-lib/blob/master/demo/showcase/DateTimePicker/DateTimePicker_Android.gif?raw=true
 */
/*eslint-enable*/
const DateTimePicker = forwardRef((props: DateTimePickerProps, ref) => {
    const {
        value: propsValue,
        renderInput,
        editable,
        mode = 'date',
        dateFormat,
        timeFormat,
        dateFormatter,
        timeFormatter,
        dateTimeFormatter,
        minimumDate,
        maximumDate,
        locale,
        is24Hour,
        minuteInterval,
        timeZoneOffsetInMinutes,
        themeVariant = Colors.getScheme(),
        onChange,
        dialogProps,
        migrateDialog,
        headerStyle,
        testID,
        display = Constants.isIOS ? 'spinner' : undefined,
        ...others
    } = props;
    const [value, setValue] = useState(propsValue);
    const chosenDate = useRef<any>(propsValue);
    const expandable = useRef<any>();
    const textField = useRef<any>();
    useImperativeHandle(ref, () => {
        return {
            validate: () => textField.current?.validate()
        };
    });
    useEffect(() => {
        if (!RNDateTimePicker) {
            // eslint-disable-next-line max-len
            console.error(`RNUILib DateTimePicker component requires installing "@react-native-community/datetimepicker" dependency`);
        }
    }, []);
    useDidUpdate(() => {
        setValue(propsValue);
    }, [propsValue]);
    const _dialogProps = useMemo(() => {
        return {
            width: '100%',
            height: null,
            bottom: true,
            centerH: true,
            containerStyle: styles.dialog,
            testID: `${testID}.dialog`,
            supportedOrientations: ['portrait', 'landscape', 'landscape-left', 'landscape-right'],
            ...dialogProps
        };
    }, [dialogProps, testID]);
    const {
        getStringValue: getStringValueOld
    } = useOldApi({
        dateFormat,
        dateFormatter,
        timeFormat,
        timeFormatter
    });
    const getStringValue = () => {
        if (value) {
            if (dateTimeFormatter) {
                return dateTimeFormatter(value, mode as any);
            } else {
                return getStringValueOld(value, mode);
                // TODO: once we remove the old implementation, add the following:
                // return mode === 'time' ? value.toLocaleTimeString() : value.toLocaleDateString();
            }
        }
    };
    const toggleExpandableOverlay = useCallback(() => {
        expandable.current?.toggleExpandable?.();
    }, []);
    const onDonePressed = useCallback(() => {
        toggleExpandableOverlay();
        if (Constants.isIOS && !chosenDate.current) {
            // since handleChange() is not called on iOS when there is no actual change
            chosenDate.current = new Date();
        }
        onChange?.(chosenDate.current);
        setValue(chosenDate.current);
    }, [toggleExpandableOverlay, onChange]);
    const handleChange = useCallback((event: any = {}, date: any) => {


        // NOTE: will be called on Android even when there was no actual change
        if (event.type !== 'dismissed' && date !== undefined) {
            chosenDate.current = date;
            if (Constants.isAndroid) {
                onDonePressed();
            } else {

            }
        } else if (event.type === 'dismissed' && Constants.isAndroid) {
            toggleExpandableOverlay();
        }
    }, [onDonePressed, toggleExpandableOverlay]);
    const renderHeader = () => {
        return <View
            row
            spread
            bg-$backgroundDefault
            paddingH-20
            style={[styles.header, headerStyle]}
            testID={`${testID}.header`}
        >
            <Button
                link
                iconSource={Assets.icons.x}
                iconStyle={{
                    tintColor: Colors.$iconDefault
                }}
                onPress={toggleExpandableOverlay}
                testID={`${testID}.cancel`}
            />

            <Button
                link
                iconSource={Assets.icons.check}
                onPress={onDonePressed}
                testID={`${testID}.done`}
            />
        </View>;
    };
    const renderDateTimePicker = useCallback(() => {
        if (!RNDateTimePicker) {
            return null;
        }
        return <RNDateTimePicker
            mode={mode}
            value={value || new Date()} onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            locale={locale}
            is24Hour={is24Hour}
            minuteInterval={minuteInterval}
            timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
            display={display as any}
            themeVariant={themeVariant}
            testID={`${testID}.picker`}
        />;
    }, [mode, value, handleChange, minimumDate, maximumDate, locale, is24Hour, minuteInterval, timeZoneOffsetInMinutes, themeVariant]);

    const actions = useMemo(() => {
        const res: UiBtnProps[] = []
        res.push({
            label: 'Готово',
            onPress: () => onDonePressed()
        })
        return res
    }, [])

    const renderIOSExpandableOverlay = () => {
        return <View paddingV-30 paddingH-20>
            {renderDateTimePicker()}
            <UiActions items={actions}/>
        </View>;
    };
    const renderAndroidDateTimePicker = useCallback(({visible}: any) => {
        if (visible) {
            return renderDateTimePicker();
        }
    }, [renderDateTimePicker]);
    return <>
        <ExpandableOverlay
            ref={expandable}
            expandableContent={Constants.isIOS ? renderIOSExpandableOverlay() : undefined}
            useDialog
            dialogProps={_dialogProps}
            migrateDialog={migrateDialog as any}
            disabled={editable === false}
            // NOTE: Android picker comes with its own overlay built-in therefor we're not using ExpandableOverlay for it
            renderCustomOverlay={Constants.isAndroid ? renderAndroidDateTimePicker : undefined}
            testID={`${testID}.overlay`}
        >
            {renderInput ?
                renderInput({
                    ...props,
                    value: getStringValue()
                })
                :
                <TextField
                    {...others}
                    ref={textField}
                    testID={testID}
                    editable={editable}
                    value={getStringValue()}
                />
            }
        </ExpandableOverlay>
    </>;
});
DateTimePicker.displayName = 'DateTimePicker';
export {DateTimePicker};
// @ts-ignore
export default asBaseComponent(DateTimePicker);
const styles = StyleSheet.create({
    header: {
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: Colors.$outlineDefault
    },
    dialog: {
        backgroundColor: Colors.$backgroundDefault,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    }
});
