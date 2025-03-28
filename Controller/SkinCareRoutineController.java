package com.example.SkinCareSellProductSysterm.Controller;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/api/skin-care-routines")
public class SkinCareRoutineController {

    @Autowired
    private SkinCareRoutineService skinCareRoutineService;

    @PostMapping
    public ResponseEntity<SkinCareRoutine> createSkinCareRoutine(@Valid @RequestBody SkinCareRoutineRequest request) {
        return ResponseEntity.ok(skinCareRoutineService.createSkinCareRoutine(request));
    }

    @GetMapping
    public ResponseEntity<List<SkinCareRoutine>> getAllSkinCareRoutines() {
        return ResponseEntity.ok(skinCareRoutineService.getAllSkinCareRoutines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkinCareRoutine> getSkinCareRoutineById(@PathVariable long id) {
        return ResponseEntity.ok(skinCareRoutineService.getSkinCareRoutineById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSkinCareRoutine(@PathVariable long id) {
        skinCareRoutineService.deleteSkinCareRoutine(id);
        return ResponseEntity.ok("Deleted skin care routine with ID: " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkinCareRoutine> updateSkinCareRoutine(@PathVariable long id, @Valid @RequestBody SkinCareRoutineRequest request) {
        return ResponseEntity.ok(skinCareRoutineService.updateSkinCareRoutine(id, request));
    }

    @GetMapping("/by-skin-type/{skinTypeId}")
    public ResponseEntity<List<SkinCareRoutine>> getAllBySkinTypeId(@PathVariable long skinTypeId) {
        return ResponseEntity.ok(skinCareRoutineService.getAllBySkinTypeId(skinTypeId));
    }
}
