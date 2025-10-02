package com.student.perf.EduTrack.config;

import com.student.perf.EduTrack.model.Semester;
import com.student.perf.EduTrack.repository.SemesterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@Component
public class SemesterDataLoader implements CommandLineRunner {

    @Autowired
    private SemesterRepository semesterRepository;

    @Override
    public void run(String... args) throws Exception {
        if (semesterRepository.count() != 0) {
            System.out.println("Semester collection already populated - skipping seeding.");
            return;
        }

        // -----------------------------
        // Common semesters (1 & 2) for all departments
        // -----------------------------
//        Map<Integer, List<String>> commonSubjects = Map.of(
//                1, List.of("math1", "physics1", "chemistry", "eng-drawing", "comm-skills"),
//                2, List.of("math2", "physics2", "basic-elec", "prog-fundamentals", "env-studies")
//        );

        String[] departments = {"Computer Science", "Electrical", "IT", "ME"};
//
//        for (String dept : departments) {
//            for (int sem = 1; sem <= 2; sem++) {
//                semesterRepository.save(create(dept, "Semester " + sem, commonSubjects.get(sem)));
//            }
//        }

        // -----------------------------
        // Department-specific semesters (3–8)
        // -----------------------------
        Map<String, Map<Integer, List<String>>> deptSubjects = Map.of(
                "Computer Science", Map.of(
                        1,List.of("cs-1-math1", "cs-1-phys1", "cs-1-chem", "cs-1-ed", "cs-1-comm"),
                        2,List.of("cs-2-math2", "cs-2-phys2", "cs-2-bee", "cs-2-pf", "cs-2-es"),
                        3, List.of("cs-3-math3", "cs-3-phy3", "cs-3-pf", "cs-3-engd", "cs-3-comm"),
                        4, List.of("cs-4-math4", "cs-4-ds", "cs-4-dl", "cs-4-dm", "cs-4-es"),
                        5, List.of("cs-5-dsa", "cs-5-db", "cs-5-co", "cs-5-oop", "cs-5-ps"),
                        6, List.of("cs-6-os", "cs-6-cn", "cs-6-se", "cs-6-toc", "cs-6-daa"),
                        7, List.of("cs-7-dbms", "cs-7-ml", "cs-7-web", "cs-7-cd", "cs-7-elective1"),
                        8, List.of("cs-8-ai", "cs-8-cloud", "cs-8-mobile", "cs-8-elective2", "cs-8-project")
                ),
                "Electrical", Map.of(
                        1,List.of("ece-1-math1", "ece-1-phys1", "ece-1-chem", "ece-1-ed", "ece-1-comm"),
                        2,List.of("ece-2-math2", "ece-2-phys2", "ece-2-bee", "ece-2-pf", "ece-2-es"),
                        3, List.of("ece-3-math3", "ece-3-phy3", "ece-3-be", "ece-3-pf", "ece-3-comm"),
                        4, List.of("ece-4-math4", "ece-4-ct", "ece-4-dl", "ece-4-ss", "ece-4-es"),
                        5, List.of("ece-5-ae", "ece-5-micro", "ece-5-em", "ece-5-nt", "ece-5-ps"),
                        6, List.of("ece-6-cs", "ece-6-ctrl", "ece-6-dsp", "ece-6-esys", "ece-6-elective1"),
                        7, List.of("ece-7-vlsi", "ece-7-ant", "ece-7-opt", "ece-7-elective2", "ece-7-project"),
                        8, List.of("ece-8-wire", "ece-8-rf", "ece-8-image", "ece-8-elective3", "ece-8-indtrain")
                ),
                "IT", Map.of(
                        1,List.of("it-1-math1", "it-1-phys1", "it-1-chem", "it-1-ed", "it-1-comm"),
                        2,List.of("it-2-math2", "it-2-phys2", "it-2-bee", "it-2-pf", "it-2-es"),
                        3, List.of("it-3-math3", "it-3-phy3", "it-3-pf", "it-3-engd", "it-3-comm"),
                        4, List.of("it-4-math4", "it-4-ds", "it-4-dl", "it-4-dm", "it-4-es"),
                        5, List.of("it-5-dsa", "it-5-db", "it-5-co", "it-5-oop", "it-5-ps"),
                        6, List.of("it-6-os", "it-6-cn", "it-6-se", "it-6-toc", "it-6-daa"),
                        7, List.of("it-7-dbms", "it-7-ml", "it-7-web", "it-7-cd", "it-7-elective1"),
                        8, List.of("it-8-ai", "it-8-cloud", "it-8-mobile", "it-8-elective2", "it-8-project")
                ),
                "ME", Map.of(
                        1,List.of("me-1-math1", "me-1-phys1", "me-1-chem", "me-1-ed", "me-1-comm"),
                        2,List.of("me-2-math2", "me-2-phys2", "me-2-bee", "me-2-pf", "me-2-es"),
                        3, List.of("me-3-math3", "me-3-engg", "me-3-thermo", "me-3-pf", "me-3-work"),
                        4, List.of("me-4-math4", "me-4-ms", "me-4-mech", "me-4-es", "me-4-som1"),
                        5, List.of("me-5-thermo", "me-5-manuf", "me-5-mom", "me-5-ps", "me-5-fm1"),
                        6, List.of("me-6-ht", "me-6-md1", "me-6-mtech", "me-6-elective1", "me-6-cad"),
                        7, List.of("me-7-md2", "me-7-ic", "me-7-indm", "me-7-elective2", "me-7-project"),
                        8, List.of("me-8-auto", "me-8-robot", "me-8-advmanuf", "me-8-elective3", "me-8-indtrain")
                )
        );

        for (String dept : departments) {
            Map<Integer, List<String>> semesters = deptSubjects.get(dept);
            for (Map.Entry<Integer, List<String>> entry : semesters.entrySet()) {
                semesterRepository.save(create(dept, "Semester " + entry.getKey(), entry.getValue()));
            }
        }

        System.out.println("Semester collection seeded with subject codes for all semesters.");
    }

    private Semester create(String dept, String semName, List<String> subjects) {
        Semester semester = new Semester();
        semester.setDepartment(dept);
        semester.setSemester(semName);
        semester.setSubjects(subjects);
        return semester;
    }
}
