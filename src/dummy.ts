import * as send_text_to_vrc from "send_text_to_vrc"

async function dummy(files: Array<send_text_to_vrc.File>) {
    const file = new send_text_to_vrc.File("DUMMY", ["DUMMY"]);
    for (let i = 0; i < 5000; i++) {
        file.push(["DUMMY"]);
    }

    files.push(file);
}