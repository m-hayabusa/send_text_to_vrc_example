import fetch from "node-fetch";
import * as send_text_to_vrc from "send_text_to_vrc"

const Forecast_telops = new Map([[100, "晴"], [101, "晴時々曇"], [102, "晴一時雨"], [103, "晴時々雨"], [104, "晴一時雪"], [105, "晴時々雪"], [106, "晴一時雨か雪"], [107, "晴時々雨か雪"], [108, "晴一時雨か雷雨"], [110, "晴後時々曇"], [111, "晴後曇"], [112, "晴後一時雨"], [113, "晴後時々雨"], [114, "晴後雨"], [115, "晴後一時雪"], [116, "晴後時々雪"], [117, "晴後雪"], [118, "晴後雨か雪"], [119, "晴後雨か雷雨"], [120, "晴朝夕一時雨"], [121, "晴朝の内一時雨"], [122, "晴夕方一時雨"], [123, "晴山沿い雷雨"], [124, "晴山沿い雪"], [125, "晴午後は雷雨"], [126, "晴昼頃から雨"], [127, "晴夕方から雨"], [128, "晴夜は雨"], [130, "朝の内霧後晴"], [131, "晴明け方霧"], [132, "晴朝夕曇"], [140, "晴時々雨で雷を伴う"], [160, "晴一時雪か雨"], [170, "晴時々雪か雨"], [181, "晴後雪か雨"], [200, "曇"], [201, "曇時々晴"], [202, "曇一時雨"], [203, "曇時々雨"], [204, "曇一時雪"], [205, "曇時々雪"], [206, "曇一時雨か雪"], [207, "曇時々雨か雪"], [208, "曇一時雨か雷雨"], [209, "霧"], [210, "曇後時々晴"], [211, "曇後晴"], [212, "曇後一時雨"], [213, "曇後時々雨"], [214, "曇後雨"], [215, "曇後一時雪"], [216, "曇後時々雪"], [217, "曇後雪"], [218, "曇後雨か雪"], [219, "曇後雨か雷雨"], [220, "曇朝夕一時雨"], [221, "曇朝の内一時雨"], [222, "曇夕方一時雨"], [223, "曇日中時々晴"], [224, "曇昼頃から雨"], [225, "曇夕方から雨"], [226, "曇夜は雨"], [228, "曇昼頃から雪"], [229, "曇夕方から雪"], [230, "曇夜は雪"], [231, "曇海上海岸は霧か霧雨"], [240, "曇時々雨で雷を伴う"], [250, "曇時々雪で雷を伴う"], [260, "曇一時雪か雨"], [270, "曇時々雪か雨"], [281, "曇後雪か雨"], [300, "雨"], [301, "雨時々晴"], [302, "雨時々止む"], [303, "雨時々雪"], [304, "雨か雪"], [306, "大雨"], [308, "雨で暴風を伴う"], [309, "雨一時雪"], [311, "雨後晴"], [313, "雨後曇"], [314, "雨後時々雪"], [315, "雨後雪"], [316, "雨か雪後晴"], [317, "雨か雪後曇"], [320, "朝の内雨後晴"], [321, "朝の内雨後曇"], [322, "雨朝晩一時雪"], [323, "雨昼頃から晴"], [324, "雨夕方から晴"], [325, "雨夜は晴"], [326, "雨夕方から雪"], [327, "雨夜は雪"], [328, "雨一時強く降る"], [329, "雨一時みぞれ"], [340, "雪か雨"], [350, "雨で雷を伴う"], [361, "雪か雨後晴"], [371, "雪か雨後曇"], [400, "雪"], [401, "雪時々晴"], [402, "雪時々止む"], [403, "雪時々雨"], [405, "大雪"], [406, "風雪強い"], [407, "暴風雪"], [409, "雪一時雨"], [411, "雪後晴"], [413, "雪後曇"], [414, "雪後雨"], [420, "朝の内雪後晴"], [421, "朝の内雪後曇"], [422, "雪昼頃から雨"], [423, "雪夕方から雨"], [425, "雪一時強く降る"], [426, "雪後みぞれ"], [427, "雪一時みぞれ"], [450, "雪で雷を伴う"]]);
import { Convert as forecastConveter } from "./forecastConverter.js";

export async function weahter_jma(files: Array<send_text_to_vrc.File>) {
    let file_FileList = new send_text_to_vrc.File("jma.go.jp/forecast", ["officeCode", "name", "reportDatetime" ,"filename_Forecast", "filename_RainPops", "filename_Weekly"]);

    const res = await fetch("https://www.jma.go.jp/bosai/forecast/data/forecast/010000.json");
    const data = forecastConveter.toForecast(await res.text());

    data.forEach(element => {
        // console.log(element.name, element.officeCode, element.srf.publishingOffice);

        let file_Forecast = new send_text_to_vrc.File("f_" + element.officeCode, ["date", "wC", "w", "mT", "MT"]);
        let file_RainPops = new send_text_to_vrc.File("r_" + element.officeCode, ["date", "pops"]);
        let file_Weekly = new send_text_to_vrc.File("w_" + element.officeCode, ["date", "wC", "w", "rel", "pops", "mT", "MT"]);

        let info = element.srf.timeSeries[0];
        let rain = element.srf.timeSeries[1];
        let temp = element.srf.timeSeries[2];
        let week = element.week.timeSeries;

        // console.log("降水確率");
        for (let i = 0; i < rain.timeDefines.length; i++) {
            file_RainPops.push([rain.timeDefines[i].toISOString(), rain.areas.pops ? rain.areas.pops[i] : ""]);
            // console.log(rain.timeDefines[i].toLocaleString("ja-JP", { timeZone: 'Asia/Tokyo' }), rain.areas.pops ? rain.areas.pops[i] : "", "%");
        }
        files.push(file_RainPops);

        for (let i = 0; i <= 1; i++) {
            let weatherCode = "";
            let weather = "";
            let minTemp = "";
            let maxTemp = "";

            // console.log("予報");
            if ((i < info.timeDefines.length) && i < 2) {
                weatherCode = info.areas.weatherCodes ? info.areas.weatherCodes[i] : "0";
                weather = Forecast_telops.get(parseInt(weatherCode)) ?? "";
                // let weathers = info.areas.weathers ? info.areas.weathers[i] : "";
                // let winds = info.areas.winds ? info.areas.winds[i] : "";
                // let waves = info.areas.waves ? info.areas.waves[i] : "";
                // 
                // console.log(info.timeDefines[i].toLocaleDateString("ja-JP", { timeZone: 'Asia/Tokyo' }), Forecast_telops.get(parseInt(weatherCode)));
            }

            // 0のとき後ろから2,3番目
            // 1のとき後ろから0,1番目
            // 当日の最低気温のとこ意味がわからん

            let itt = (temp.timeDefines.length - 1) - (1 - i) * 2;
            // console.log(i, itt);
            if (itt > 0) {
                if (temp.areas.temps) {
                    if (itt >= 0)
                        maxTemp = temp.areas.temps[itt]

                    if (itt >= 1 && temp.timeDefines[itt - 1].toString() < temp.timeDefines[itt].toString())
                        minTemp = temp.areas.temps[itt - 1]
                }
            }
            // console.log("最低・最高気温", minTemp, maxTemp);
            // console.log([info.timeDefines[i].toISOString(), weatherCode, minTemp, maxTemp])
            file_Forecast.push([info.timeDefines[i].toISOString(), weatherCode, weather, minTemp, maxTemp]);
        }
        files.push(file_Forecast);

        for (let i = 0; i < 7; i++) {
            if (week[0] && week[1]) {
                let wC = week[0].areas.weatherCodes ? week[0].areas.weatherCodes[i] : "";
                file_Weekly.push([
                    week[0].timeDefines[i].toISOString(),
                    wC,
                    Forecast_telops.get(parseInt(wC)) ?? "",
                    week[0].areas.reliabilities ? week[0].areas.reliabilities[i] : "",
                    week[0].areas.pops ? week[0].areas.pops[i] : "",
                    week[1].areas.tempsMin ? week[1].areas.tempsMin[i] : "",
                    week[1].areas.tempsMax ? week[1].areas.tempsMax[i] : "",
                ]);
            }
        }
        files.push(file_Weekly);

        // console.log([element.officeCode, element.name, file_Forecast.Filename, file_RainPops.Filename]);
        file_FileList.push([element.officeCode, element.name, element.srf.reportDatetime.toISOString(), file_Forecast.Filename, file_RainPops.Filename, file_Weekly.Filename]);
    });

    files.push(file_FileList);
}