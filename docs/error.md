# 问题

1. 报错 `Error: error:0308010C:digital envelope routines::unsupported`

解决方案

1. 需要降级为 node@16
2. 启用旧版 OpenSSL
   1. `export NODE_OPTIONS=--openssl-legacy-provider`
3. `npm audit fix --force` 复杂的情况，不是很靠谱

参考：

- https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported
