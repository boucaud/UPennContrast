cmake_minimum_required(VERSION 3.10)
project(BlobToDot)

set (sources main.cxx)

set(io_component ITKImageIO)
if(EMSCRIPTEN)
    set(io_component BridgeJavaScript)
endif()
message(${io_component})

find_package(ITK REQUIRED
    COMPONENTS
    ITKImageIO
    ${io_component}
    BridgeJavaScript
    ITKMesh
    ITKIOMeshBase
    ITKImageIntensity
    )

include (${ITK_USE_FILE})

add_executable(MaxInRegion ${sources})
target_link_libraries(MaxInRegion ${ITK_LIBRARIES})

# if(EMSCRIPTEM)
#     include(ITKBridgeJavaScript)
#     web_add_executable(MaxInRegion ${sources})
#     web_target_link_libraries(MaxInRegion ${ITK_LIBRARIES})
# else()
#     add_executable(MaxInRegion ${sources})
# endif()

