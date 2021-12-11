cmd_Release/talib.node := ln -f "Release/obj.target/talib.node" "Release/talib.node" 2>/dev/null || (rm -rf "Release/talib.node" && cp -af "Release/obj.target/talib.node" "Release/talib.node")
