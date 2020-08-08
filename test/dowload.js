const {patchDownload} = require('../src/scripts/downloader/common')

async function testPatchDownload() {
    const data = [
        {
            "downloads": {
                "artifact": {
                    "path": "com/mojang/patchy/1.1/patchy-1.1.jar",
                    "sha1": "aef610b34a1be37fa851825f12372b78424d8903",
                    "size": 15817,
                    "url": "https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar"
                }
            },
            "name": "com.mojang:patchy:1.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "oshi-project/oshi-core/1.1/oshi-core-1.1.jar",
                    "sha1": "9ddf7b048a8d701be231c0f4f95fd986198fd2d8",
                    "size": 30973,
                    "url": "https://libraries.minecraft.net/oshi-project/oshi-core/1.1/oshi-core-1.1.jar"
                }
            },
            "name": "oshi-project:oshi-core:1.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "net/java/dev/jna/jna/4.4.0/jna-4.4.0.jar",
                    "sha1": "cb208278274bf12ebdb56c61bd7407e6f774d65a",
                    "size": 1091208,
                    "url": "https://libraries.minecraft.net/net/java/dev/jna/jna/4.4.0/jna-4.4.0.jar"
                }
            },
            "name": "net.java.dev.jna:jna:4.4.0"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar",
                    "sha1": "e3f70017be8100d3d6923f50b3d2ee17714e9c13",
                    "size": 913436,
                    "url": "https://libraries.minecraft.net/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar"
                }
            },
            "name": "net.java.dev.jna:platform:3.4.0"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/ibm/icu/icu4j/66.1/icu4j-66.1.jar",
                    "sha1": "72c7519b6d91f7a1f993bd44a99fe95d67211b27",
                    "size": 12935630,
                    "url": "https://libraries.minecraft.net/com/ibm/icu/icu4j/66.1/icu4j-66.1.jar"
                }
            },
            "name": "com.ibm.icu:icu4j:66.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/mojang/javabridge/1.0.22/javabridge-1.0.22.jar",
                    "sha1": "6aa6453aa99a52a5cd91749da1af6ab70e082ab3",
                    "size": 5111,
                    "url": "https://libraries.minecraft.net/com/mojang/javabridge/1.0.22/javabridge-1.0.22.jar"
                }
            },
            "name": "com.mojang:javabridge:1.0.22"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "net/sf/jopt-simple/jopt-simple/5.0.3/jopt-simple-5.0.3.jar",
                    "sha1": "cdd846cfc4e0f7eefafc02c0f5dce32b9303aa2a",
                    "size": 78175,
                    "url": "https://libraries.minecraft.net/net/sf/jopt-simple/jopt-simple/5.0.3/jopt-simple-5.0.3.jar"
                }
            },
            "name": "net.sf.jopt-simple:jopt-simple:5.0.3"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "io/netty/netty-all/4.1.25.Final/netty-all-4.1.25.Final.jar",
                    "sha1": "d0626cd3108294d1d58c05859add27b4ef21f83b",
                    "size": 3823147,
                    "url": "https://libraries.minecraft.net/io/netty/netty-all/4.1.25.Final/netty-all-4.1.25.Final.jar"
                }
            },
            "name": "io.netty:netty-all:4.1.25.Final"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/google/guava/guava/21.0/guava-21.0.jar",
                    "sha1": "3a3d111be1be1b745edfa7d91678a12d7ed38709",
                    "size": 2521113,
                    "url": "https://libraries.minecraft.net/com/google/guava/guava/21.0/guava-21.0.jar"
                }
            },
            "name": "com.google.guava:guava:21.0"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/apache/commons/commons-lang3/3.5/commons-lang3-3.5.jar",
                    "sha1": "6c6c702c89bfff3cd9e80b04d668c5e190d588c6",
                    "size": 479881,
                    "url": "https://libraries.minecraft.net/org/apache/commons/commons-lang3/3.5/commons-lang3-3.5.jar"
                }
            },
            "name": "org.apache.commons:commons-lang3:3.5"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "commons-io/commons-io/2.5/commons-io-2.5.jar",
                    "sha1": "2852e6e05fbb95076fc091f6d1780f1f8fe35e0f",
                    "size": 208700,
                    "url": "https://libraries.minecraft.net/commons-io/commons-io/2.5/commons-io-2.5.jar"
                }
            },
            "name": "commons-io:commons-io:2.5"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "commons-codec/commons-codec/1.10/commons-codec-1.10.jar",
                    "sha1": "4b95f4897fa13f2cd904aee711aeafc0c5295cd8",
                    "size": 284184,
                    "url": "https://libraries.minecraft.net/commons-codec/commons-codec/1.10/commons-codec-1.10.jar"
                }
            },
            "name": "commons-codec:commons-codec:1.10"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar",
                    "sha1": "39c7796b469a600f72380316f6b1f11db6c2c7c4",
                    "size": 208338,
                    "url": "https://libraries.minecraft.net/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar"
                }
            },
            "name": "net.java.jinput:jinput:2.0.5"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar",
                    "sha1": "e12fe1fda814bd348c1579329c86943d2cd3c6a6",
                    "size": 7508,
                    "url": "https://libraries.minecraft.net/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar"
                }
            },
            "name": "net.java.jutils:jutils:1.0.0"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/mojang/brigadier/1.0.17/brigadier-1.0.17.jar",
                    "sha1": "c6b7dc51dd44379cc751b7504816006e9be4b1e6",
                    "size": 77392,
                    "url": "https://libraries.minecraft.net/com/mojang/brigadier/1.0.17/brigadier-1.0.17.jar"
                }
            },
            "name": "com.mojang:brigadier:1.0.17"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/mojang/datafixerupper/3.0.25/datafixerupper-3.0.25.jar",
                    "sha1": "b3e9ae66d5a69b4aa43d9dbe1e2b2d1401251343",
                    "size": 672421,
                    "url": "https://libraries.minecraft.net/com/mojang/datafixerupper/3.0.25/datafixerupper-3.0.25.jar"
                }
            },
            "name": "com.mojang:datafixerupper:3.0.25"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/google/code/gson/gson/2.8.0/gson-2.8.0.jar",
                    "sha1": "c4ba5371a29ac9b2ad6129b1d39ea38750043eff",
                    "size": 231952,
                    "url": "https://libraries.minecraft.net/com/google/code/gson/gson/2.8.0/gson-2.8.0.jar"
                }
            },
            "name": "com.google.code.gson:gson:2.8.0"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "com/mojang/authlib/1.6.25/authlib-1.6.25.jar",
                    "sha1": "5bd0ce00c1e1f483641f85bccb02d1956dd77ec0",
                    "size": 70197,
                    "url": "https://libraries.minecraft.net/com/mojang/authlib/1.6.25/authlib-1.6.25.jar"
                }
            },
            "name": "com.mojang:authlib:1.6.25"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar",
                    "sha1": "a698750c16740fd5b3871425f4cb3bbaa87f529d",
                    "size": 365552,
                    "url": "https://libraries.minecraft.net/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar"
                }
            },
            "name": "org.apache.commons:commons-compress:1.8.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar",
                    "sha1": "18f4247ff4572a074444572cee34647c43e7c9c7",
                    "size": 589512,
                    "url": "https://libraries.minecraft.net/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar"
                }
            },
            "name": "org.apache.httpcomponents:httpclient:4.3.3"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar",
                    "sha1": "f6f66e966c70a83ffbdb6f17a0919eaf7c8aca7f",
                    "size": 62050,
                    "url": "https://libraries.minecraft.net/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar"
                }
            },
            "name": "commons-logging:commons-logging:1.1.3"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar",
                    "sha1": "31fbbff1ddbf98f3aa7377c94d33b0447c646b6e",
                    "size": 282269,
                    "url": "https://libraries.minecraft.net/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar"
                }
            },
            "name": "org.apache.httpcomponents:httpcore:4.3.2"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "it/unimi/dsi/fastutil/8.2.1/fastutil-8.2.1.jar",
                    "sha1": "5ad88f325e424f8dbc2be5459e21ea5cab3864e9",
                    "size": 18800417,
                    "url": "https://libraries.minecraft.net/it/unimi/dsi/fastutil/8.2.1/fastutil-8.2.1.jar"
                }
            },
            "name": "it.unimi.dsi:fastutil:8.2.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/apache/logging/log4j/log4j-api/2.8.1/log4j-api-2.8.1.jar",
                    "sha1": "e801d13612e22cad62a3f4f3fe7fdbe6334a8e72",
                    "size": 228859,
                    "url": "https://libraries.minecraft.net/org/apache/logging/log4j/log4j-api/2.8.1/log4j-api-2.8.1.jar"
                }
            },
            "name": "org.apache.logging.log4j:log4j-api:2.8.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/apache/logging/log4j/log4j-core/2.8.1/log4j-core-2.8.1.jar",
                    "sha1": "4ac28ff2f1ddf05dae3043a190451e8c46b73c31",
                    "size": 1402925,
                    "url": "https://libraries.minecraft.net/org/apache/logging/log4j/log4j-core/2.8.1/log4j-core-2.8.1.jar"
                }
            },
            "name": "org.apache.logging.log4j:log4j-core:2.8.1"
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1.jar",
                    "sha1": "2bb514e444994c6fece99a21f76e0c90438e377f",
                    "size": 317748,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2.jar",
                    "sha1": "8ad6294407e15780b43e84929c40e4c5e997972e",
                    "size": 321900,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1.jar",
                    "sha1": "7a0c583fcbec32b15784f846df536e1837d83666",
                    "size": 38616,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-jemalloc:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-jemalloc/3.2.2/lwjgl-jemalloc-3.2.2.jar",
                    "sha1": "ee8e57a79300f78294576d87c4a587f8c99402e2",
                    "size": 34848,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.2/lwjgl-jemalloc-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-jemalloc:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-openal/3.2.1/lwjgl-openal-3.2.1.jar",
                    "sha1": "dc7ff2dabb40a141ee9bf2e326d9b1b19f3278fb",
                    "size": 80103,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.1/lwjgl-openal-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-openal:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar",
                    "sha1": "2b772a102b0a11ee5f2109a5b136f4dc7c630827",
                    "size": 80012,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-openal:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-opengl/3.2.1/lwjgl-opengl-3.2.1.jar",
                    "sha1": "57008c2374c5bc434b18adfef3f3653ee450ee18",
                    "size": 931322,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-opengl/3.2.1/lwjgl-opengl-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-opengl:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-opengl/3.2.2/lwjgl-opengl-3.2.2.jar",
                    "sha1": "6ac5bb88b44c43ea195a570aab059f63da004cd8",
                    "size": 929780,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-opengl/3.2.2/lwjgl-opengl-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-opengl:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-glfw/3.2.1/lwjgl-glfw-3.2.1.jar",
                    "sha1": "027abb7f64894b61cad163791acd8113f0b21296",
                    "size": 116708,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-glfw/3.2.1/lwjgl-glfw-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-glfw:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-glfw/3.2.2/lwjgl-glfw-3.2.2.jar",
                    "sha1": "d3ad4df38e400b8afba1de63f84338809399df5b",
                    "size": 108907,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-glfw/3.2.2/lwjgl-glfw-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-glfw:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-stb/3.2.1/lwjgl-stb-3.2.1.jar",
                    "sha1": "31f5eb5fce3791d58ec898bc5c1867d76d781ba1",
                    "size": 105765,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-stb/3.2.1/lwjgl-stb-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-stb:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-stb/3.2.2/lwjgl-stb-3.2.2.jar",
                    "sha1": "3b8e6ebc5851dd3d17e37e5cadce2eff2a429f0f",
                    "size": 104469,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-stb/3.2.2/lwjgl-stb-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-stb:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-tinyfd/3.2.1/lwjgl-tinyfd-3.2.1.jar",
                    "sha1": "259f1dbddb921e27e01b32458d6f584eb8bba13a",
                    "size": 7088,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-tinyfd/3.2.1/lwjgl-tinyfd-3.2.1.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-tinyfd:3.2.1",
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-tinyfd/3.2.2/lwjgl-tinyfd-3.2.2.jar",
                    "sha1": "fcbe606c8f8da6f8f9a05e2c540eb1ee8632b0e9",
                    "size": 7092,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-tinyfd/3.2.2/lwjgl-tinyfd-3.2.2.jar"
                }
            },
            "name": "org.lwjgl:lwjgl-tinyfd:3.2.2",
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1.jar",
                    "sha1": "2bb514e444994c6fece99a21f76e0c90438e377f",
                    "size": 317748,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1.jar"
                },
                "classifiers": {
                    "javadoc": {
                        "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-javadoc.jar",
                        "sha1": "1f6b7050737559b775d797c0ea56612b8e373fd6",
                        "size": 1287174,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-javadoc.jar"
                    },
                    "natives-linux": {
                        "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-linux.jar",
                        "sha1": "9bdd47cd63ce102cec837a396c8ded597cb75a66",
                        "size": 87484,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-linux.jar"
                    },
                    "natives-macos": {
                        "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-macos.jar",
                        "sha1": "5a4c271d150906858d475603dcb9479453c60555",
                        "size": 39835,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-macos.jar"
                    },
                    "natives-windows": {
                        "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-windows.jar",
                        "sha1": "e799d06b8969db0610e68776e0eff4b6191098bd",
                        "size": 255871,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-natives-windows.jar"
                    },
                    "sources": {
                        "path": "org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-sources.jar",
                        "sha1": "106f90ac41449004a969309488aa6e3a2f7d6731",
                        "size": 255671,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.1/lwjgl-3.2.1-sources.jar"
                    }
                }
            },
            "name": "org.lwjgl:lwjgl:3.2.1",
            "natives": {
                "osx": "natives-macos"
            },
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2.jar",
                    "sha1": "8ad6294407e15780b43e84929c40e4c5e997972e",
                    "size": 321900,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2.jar"
                },
                "classifiers": {
                    "natives-linux": {
                        "path": "org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2-natives-linux.jar",
                        "sha1": "ae7976827ca2a3741f6b9a843a89bacd637af350",
                        "size": 124776,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2-natives-linux.jar"
                    },
                    "natives-macos": {
                        "path": "org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2-natives-macos.jar",
                        "sha1": "bbfb75693bdb714c0c69c2c9f9be73d259b43b62",
                        "size": 48462,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2-natives-macos.jar"
                    },
                    "natives-windows": {
                        "path": "org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2-natives-windows.jar",
                        "sha1": "05359f3aa50d36352815fc662ea73e1c00d22170",
                        "size": 279593,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/3.2.2/lwjgl-3.2.2-natives-windows.jar"
                    }
                }
            },
            "name": "org.lwjgl:lwjgl:3.2.2",
            "natives": {
                "linux": "natives-linux",
                "windows": "natives-windows"
            },
            "rules": [
                {
                    "action": "allow"
                },
                {
                    "action": "disallow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
        {
            "downloads": {
                "artifact": {
                    "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1.jar",
                    "sha1": "7a0c583fcbec32b15784f846df536e1837d83666",
                    "size": 38616,
                    "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1.jar"
                },
                "classifiers": {
                    "javadoc": {
                        "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-javadoc.jar",
                        "sha1": "04f6897be1e2d68bff5ec5e91a2b96e32f084c09",
                        "size": 461041,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-javadoc.jar"
                    },
                    "natives-linux": {
                        "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-natives-linux.jar",
                        "sha1": "5536616b558cea2fea6330ca682fd7c733db9c43",
                        "size": 156057,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-natives-linux.jar"
                    },
                    "natives-macos": {
                        "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-natives-macos.jar",
                        "sha1": "439ab9d0264167a949cc7bcce673704322baaf50",
                        "size": 117001,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-natives-macos.jar"
                    },
                    "natives-windows": {
                        "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-natives-windows.jar",
                        "sha1": "3c869b3d7638c800b7039cd859d064658643ad6e",
                        "size": 218136,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-natives-windows.jar"
                    },
                    "sources": {
                        "path": "org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.jar",
                        "sha1": "4450dca46228c02c51bb9bbda70e7cfc3154296d",
                        "size": 31279,
                        "url": "https://libraries.minecraft.net/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.jar"
                    }
                }
            },
            "name": "org.lwjgl:lwjgl-jemalloc:3.2.1",
            "natives": {
                "osx": "natives-macos"
            },
            "rules": [
                {
                    "action": "allow",
                    "os": {
                        "name": "osx"
                    }
                }
            ]
        },
    ]
    const tasks = []
    for (const item of data) {
        tasks.push({
            URL: item.downloads.artifact.url,
            filePath: "test/" + item.downloads.artifact.path
        })
    }

    await patchDownload(tasks)
}

testPatchDownload()