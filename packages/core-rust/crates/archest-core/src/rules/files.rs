use std::collections::{HashMap, HashSet};
use crate::parser::ProjectData;
use super::RuleResult;

pub fn check_be_free_of_cycles(project: &ProjectData, target_files: &[String], is_not: bool) -> RuleResult {
    let mut violations = Vec::new();
    
    // Create a Set of targeted file paths for quick lookup
    let targeted_set: HashSet<&String> = target_files.iter().collect();

    // Build the dependency graph filtering by targeted_set
    let mut graph: HashMap<&String, Vec<&String>> = HashMap::new();

    for file in &project.files {
        if targeted_set.contains(&file.path) {
            let mut deps = Vec::new();
            for dep in &file.dependencies {
                if targeted_set.contains(dep) {
                    deps.push(dep);
                }
            }
            graph.insert(&file.path, deps);
        }
    }

    let mut visited: HashSet<&String> = HashSet::new();
    let mut rec_stack: HashSet<&String> = HashSet::new();
    let mut cycles: Vec<Vec<String>> = Vec::new();

    // To prevent storing duplicate cycles
    let mut cycle_strs: HashSet<String> = HashSet::new();

    fn is_cyclic_util<'a>(
        node: &'a String,
        path: &mut Vec<&'a String>,
        graph: &HashMap<&String, Vec<&'a String>>,
        visited: &mut HashSet<&'a String>,
        rec_stack: &mut HashSet<&'a String>,
        cycles: &mut Vec<Vec<String>>,
        cycle_strs: &mut HashSet<String>,
    ) -> bool {
        if rec_stack.contains(node) {
            if let Some(pos) = path.iter().position(|&x| x == node) {
                let mut cycle: Vec<String> = path[pos..].iter().map(|s| s.to_string()).collect();
                cycle.push(node.to_string());
                
                let cycle_str = cycle.join("->");
                if !cycle_strs.contains(&cycle_str) {
                    cycle_strs.insert(cycle_str);
                    cycles.push(cycle);
                }
            }
            return true;
        }

        if visited.contains(node) {
            return false;
        }

        visited.insert(node);
        rec_stack.insert(node);
        path.push(node);

        if let Some(neighbors) = graph.get(node) {
            for neighbor in neighbors {
                is_cyclic_util(neighbor, path, graph, visited, rec_stack, cycles, cycle_strs);
            }
        }

        rec_stack.remove(node);
        path.pop();
        false
    }

    for node in graph.keys() {
        if !visited.contains(node) {
            let mut path = Vec::new();
            is_cyclic_util(node, &mut path, &graph, &mut visited, &mut rec_stack, &mut cycles, &mut cycle_strs);
        }
    }

    if is_not && cycles.is_empty() {
        violations.push("Expected cyclic dependencies, but found none.".to_string());
    } else if !is_not && !cycles.is_empty() {
        for cycle in cycles {
            violations.push(format!("Cycle detected: {}", cycle.join(" -> ")));
        }
    }

    RuleResult {
        pass: violations.is_empty(),
        message: violations.join("\n"),
    }
}
